"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import PageHeader from "@/app/components/PageHeader/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { FaCheck } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";

import { toast } from "sonner";

export default function SettingsPage() {
  const { user, signOut, updateProfile } = useAuth();
  const { setTheme: applyTheme } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [theme, setTheme] = useState("light");
  const [saving, setSaving] = useState(false);

  const nameChanged =
    firstName !== (user?.first_name ?? "") ||
    lastName !== (user?.last_name ?? "");

  useEffect(() => {
    if (!user) return;

    setFirstName(user.first_name ?? "");
    setLastName(user.last_name ?? "");
    setTheme(user.theme ?? "light");
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(firstName, lastName, theme);
    } finally {
      setSaving(false);
      toast("Profile has been updated!", {
        icon: <FaCheck className="w-4 h-4 text-green-500" />,
      });
    }
  };

  const handleThemeToggle = async (checked: boolean) => {
    const next = checked ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
    await updateProfile(firstName, lastName, next);
    toast(`Theme has been changed to ${next}`, {
      icon: <FaCheck className="w-4 h-4 text-green-500" />,
    });
  };

  return (
    <main className="max-w-2xl w-full mx-auto px-4 pb-24 md:pb-8 flex flex-col gap-6">
      <PageHeader title="Settings" />

      {/* Profile */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Profile
        </h2>
        <div className="bg-card border border-border rounded-2xl p-4">
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground">
                Name
              </label>
              <p className="text-xs text-muted-foreground">
                This is how you'll appear in the app.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              disabled={saving || !firstName.trim() || !nameChanged}
              className="self-end"
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </form>
        </div>
      </section>

      {/* Appearance */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Appearance
        </h2>
        <div className="bg-card border border-border rounded-2xl divide-y divide-border">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-foreground">Dark mode</p>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark theme.
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Account
        </h2>
        <div className="bg-card border border-border rounded-2xl">
          <Button
            variant="ghost"
            onClick={() => signOut()}
            className="w-full justify-start px-4 py-4 h-auto text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-2xl"
          >
            <FaSignOutAlt className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </section>
    </main>
  );
}
