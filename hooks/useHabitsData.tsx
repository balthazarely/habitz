import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { todayDate, todayShort } from "@/lib/today";
import { toast } from "sonner";
import { FaCheckCircle } from "react-icons/fa";
import type { User } from "@/context/AuthContext";

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  frequency: string[];
  emoji: string | null;
  created_at: string;
}

export function useHabitsData(
  user: User | null,
  syncToday: (habits: Habit[]) => Promise<void>,
  onHabitDeleted: (id: string) => void,
) {
  const [habits, setHabits] = useState<Habit[] | null>(null);

  const todaysHabits =
    habits === null ? null : habits.filter((h) => h.frequency.includes(todayShort));

  const fetchHabits = async (): Promise<Habit[] | null> => {
    if (!user) return null;
    const { data } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setHabits(data);
    return data ?? null;
  };

  const createHabit = async (
    name: string,
    description: string,
    frequency: string[],
    emoji?: string,
  ) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("habits")
      .insert({ name, description, frequency, emoji: emoji ?? null, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      const next = [data, ...(habits ?? [])];
      setHabits(next);
      toast("Habit created!", { icon: <FaCheckCircle className="w-4 h-4 text-green-500" /> });
      if (frequency.includes(todayShort)) await syncToday(next);
    }
    return data;
  };

  const updateHabit = async (
    id: string,
    name: string,
    description: string,
    frequency: string[],
    emoji?: string,
  ) => {
    const { data, error } = await supabase
      .from("habits")
      .update({ name, description, frequency, emoji: emoji ?? null })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      const next = (habits ?? []).map((h) => (h.id === id ? data : h));
      setHabits(next);
      toast("Habit updated!", { icon: <FaCheckCircle className="w-4 h-4 text-green-500" /> });
      await syncToday(next);
    }
  };

  const deleteHabit = async (id: string) => {
    // Delete the completion row first — if the habit is deleted first, the FK
    // "on delete set null" fires and makes it impossible to find by habit_id.
    await supabase
      .from("habit_completions")
      .delete()
      .eq("habit_id", id)
      .eq("completed_on", todayDate);

    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) throw error;

    setHabits((prev) => (prev ?? []).filter((h) => h.id !== id));
    onHabitDeleted(id);
    toast("Habit deleted!", { icon: <FaCheckCircle className="w-4 h-4 text-red-500" /> });
  };

  return { habits, todaysHabits, fetchHabits, createHabit, updateHabit, deleteHabit };
}
