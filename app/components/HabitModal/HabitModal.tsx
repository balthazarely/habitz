"use client";

import { useHabit, type Habit } from "@/context/HabitsContext";
import { useState } from "react";
import { suggestEmoji } from "@/lib/emojiSuggestions";
import dynamic from "next/dynamic";
import type { EmojiClickData } from "emoji-picker-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  habit?: Habit;
  onClose?: () => void;
}

export default function HabitModal({ habit, onClose }: Props) {
  const { createHabit, updateHabit } = useHabit();
  const isEditing = !!habit;

  const [open, setOpen] = useState(isEditing);
  const [name, setName] = useState(habit?.name ?? "");
  const [description, setDescription] = useState(habit?.description ?? "");
  const [selectedDays, setSelectedDays] = useState<string[]>(
    habit?.frequency ?? [],
  );
  const [emoji, setEmoji] = useState<string | null>(habit?.emoji ?? null);
  const [emojiManuallySet, setEmojiManuallySet] = useState(!!habit?.emoji);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = name.trim().length > 0 && selectedDays.length > 0;

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) onClose?.();
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (!emojiManuallySet) {
      const suggestion = suggestEmoji(value);
      if (suggestion) setEmoji(suggestion);
    }
  };

  const handleEmojiClick = (data: EmojiClickData) => {
    setEmoji(data.emoji);
    setEmojiManuallySet(true);
    setPickerOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isEditing) {
        await updateHabit(
          habit.id,
          name,
          description,
          selectedDays,
          emoji ?? undefined,
        );
      } else {
        await createHabit(name, description, selectedDays, emoji ?? undefined);
        setName("");
        setDescription("");
        setSelectedDays([]);
        setEmoji(null);
      }
      handleOpenChange(false);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isEditing && (
        <>
          <DialogTrigger render={<Button className="hidden md:flex" />}>
            New Habit
          </DialogTrigger>
          <button
            onClick={() => setOpen(true)}
            className="md:hidden fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center cursor-pointer hover:opacity-90 hover:scale-105 transition-transform duration-150"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle aria-label="habit title">
            {isEditing ? "Edit habit" : "New habit"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* Emoji + Name row */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Name
            </label>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPickerOpen((v) => !v)}
                  className="w-10 h-10 rounded-lg border border-input bg-background flex items-center justify-center text-xl hover:bg-accent transition-colors shrink-0"
                >
                  {emoji ?? "😀"}
                </button>
                {pickerOpen && (
                  <div className="absolute top-12 left-0 z-50">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      height={350}
                      width={300}
                    />
                  </div>
                )}
              </div>
              <Input
                required
                placeholder="e.g. Morning run"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <Input
              placeholder="Optional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Days
            </label>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map((day) => {
                const active = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={loading || !isValid}>
            {loading ? "Saving…" : isEditing ? "Save changes" : "Create habit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
