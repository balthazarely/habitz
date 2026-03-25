"use client";

import { supabase } from "@/lib/supabaseClient";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  theme: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (
    firstName: string,
    lastName: string,
    theme: string,
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("[Auth] onAuthStateChange event:", _event, "session:", session?.user?.id ?? null);
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) {
          console.log("[Auth] profile loaded:", profile.id);
          setUser(profile);
          if (profile.theme) setTheme(profile.theme);
        } else {
          console.warn("[Auth] fetchProfile returned null, using session fallback");
          // DB unreachable but auth session is valid — use session data so the
          // loading chain isn't permanently stuck.
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
            first_name: "",
            last_name: "",
            theme: "light",
          });
        }
      } else {
        console.log("[Auth] no session, setting user null");
        setUser(null);
      }
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (id: string): Promise<User | null> => {
    console.log("[Auth] fetchProfile start:", id);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("[Auth] fetchProfile error:", error);
      return null;
    }
    console.log("[Auth] fetchProfile success:", data.id);
    return data as User;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: "", last_name: "" } },
    });
    if (error) throw error;

    const sbUser: SupabaseUser = data.user!;
    if (sbUser) {
      setUser({
        id: sbUser.id,
        email: sbUser.email!,
        first_name: "",
        last_name: "",
        theme: "light",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (data.user) {
      const profile = await fetchProfile(data.user.id);
      if (profile) setUser(profile);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  const updateProfile = async (
    firstName: string,
    lastName: string,
    theme: string,
  ) => {
    if (!user) return;
    const { data, error } = await supabase
      .from("users")
      .update({ first_name: firstName, last_name: lastName, theme })
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    if (data) setUser(data as User);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signUp, signIn, signOut, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("Must be inside provider");
  }
  return context;
}
