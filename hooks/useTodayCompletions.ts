import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { todayDate, todayShort } from "@/lib/today";
import type { User } from "@/context/AuthContext";
import type { Habit } from "./useHabitsData";

export function useTodayCompletions(user: User | null) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [completionsReady, setCompletionsReady] = useState(false);

  // Ensures a completion row exists for every habit scheduled today,
  // then rebuilds completedIds from the current rows.
  const syncAndFetchToday = useCallback(async (currentHabits: Habit[]) => {
    if (!user) return;
    const userId = user.id;

    const scheduled = currentHabits.filter((h) => h.frequency.includes(todayShort));

    if (scheduled.length > 0) {
      await supabase.from("habit_completions").upsert(
        scheduled.map((h) => ({
          user_id: userId,
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
      .eq("user_id", userId)
      .eq("completed_on", todayDate);

    if (data) {
      setCompletedIds(new Set(data.filter((c) => c.completed).map((c) => c.habit_id)));
    }
    setCompletionsReady(true);
  }, [user]);

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

  const handleHabitDeleted = useCallback((id: string) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return { completedIds, completionsReady, syncAndFetchToday, toggleCompletion, handleHabitDeleted };
}
