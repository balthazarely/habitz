"use client";

import { supabase } from "@/lib/supabaseClient";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  frequency: string[];
  emoji: string | null;
  created_at: string;
}

interface HabitContextType {
  habits: Habit[] | null;
  todaysHabits: Habit[] | null;
  completedIds: Set<string>;
  createHabit: (
    name: string,
    description: string,
    frequency: string[],
    emoji?: string,
  ) => void;
  updateHabit: (
    id: string,
    name: string,
    description: string,
    frequency: string[],
    emoji?: string,
  ) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string) => Promise<void>;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const now = new Date();
const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
const todayShort = new Date().toLocaleDateString("en-US", { weekday: "short" });

export default function HabitProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [habits, setHabits] = useState<Habit[] | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const todaysHabits =
    habits === null
      ? null
      : habits.filter((h) => h.frequency.includes(todayShort));

  useEffect(() => {
    if (!user) return;
    const init = async () => {
      const fetched = await fetchHabits();
      if (fetched) await syncAndFetchToday(fetched);
    };
    init();
  }, [user]);

  const fetchHabits = async (): Promise<Habit[] | null> => {
    const { data } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (data) setHabits(data);
    return data ?? null;
  };

  // Ensures a habit_completions row exists for every habit scheduled today,
  // then rebuilds completedIds from the current rows.
  const syncAndFetchToday = async (currentHabits: Habit[]) => {
    if (!user) return;
    const scheduled = currentHabits.filter((h) =>
      h.frequency.includes(todayShort),
    );

    if (scheduled.length > 0) {
      await supabase.from("habit_completions").upsert(
        scheduled.map((h) => ({
          user_id: user.id,
          habit_id: h.id,
          habit_name: h.name,
          completed_on: todayDate,
          completed: false,
        })),
        { onConflict: "habit_id,completed_on", ignoreDuplicates: true },
      );
    }

    const { data } = await supabase
      .from("habit_completions")
      .select("habit_id, completed")
      .eq("user_id", user.id)
      .eq("completed_on", todayDate);

    if (data) {
      setCompletedIds(
        new Set(data.filter((c) => c.completed).map((c) => c.habit_id)),
      );
    }
  };

  const toggleCompletion = async (habitId: string) => {
    const isCompleted = completedIds.has(habitId);

    setCompletedIds((prev) => {
      const next = new Set(prev);
      isCompleted ? next.delete(habitId) : next.add(habitId);
      return next;
    });

    try {
      const { error } = await supabase
        .from("habit_completions")
        .update({ completed: !isCompleted })
        .eq("habit_id", habitId)
        .eq("completed_on", todayDate);
      if (error) throw error;
    } catch {
      setCompletedIds((prev) => {
        const next = new Set(prev);
        isCompleted ? next.add(habitId) : next.delete(habitId);
        return next;
      });
    }
  };

  const createHabit = async (
    name: string,
    description: string,
    frequency: string[],
    emoji?: string,
  ) => {
    const { data, error } = await supabase
      .from("habits")
      .insert({
        name,
        description,
        frequency,
        emoji: emoji ?? null,
        user_id: user!.id,
      })
      .select()
      .single();

    if (error) throw error;
    if (data) {
      const next = [data, ...(habits ?? [])];
      setHabits(next);
      toast("Habit created!", {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      });

      if (frequency.includes(todayShort)) {
        await syncAndFetchToday(next);
      }
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
      toast("Habit editted!", {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
      });
      await syncAndFetchToday(next);
    }
  };

  const deleteHabit = async (id: string) => {
    // Delete today's completion row first, before the habit is deleted.
    // If we delete the habit first, the FK "on delete set null" fires and
    // sets habit_id to NULL, making it impossible to find the row by habit_id.
    await supabase
      .from("habit_completions")
      .delete()
      .eq("habit_id", id)
      .eq("completed_on", todayDate);

    const { error } = await supabase.from("habits").delete().eq("id", id);
    if (error) throw error;

    const next = (habits ?? []).filter((h) => h.id !== id);
    setHabits(next);
    toast("Habit deleted!", {
      icon: <CheckCircle className="w-4 h-4 text-red-500" />,
    });
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        todaysHabits,
        completedIds,
        createHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("Must be inside provider");
  }
  return context;
}
