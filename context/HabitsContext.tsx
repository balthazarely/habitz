"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useHabitsData, type Habit } from "@/hooks/useHabitsData";
import { useTodayCompletions } from "@/hooks/useTodayCompletions";
import {
  useHistoryData,
  type Completion,
  type GroupedCompletions,
} from "@/hooks/useHistoryData";

// Re-export types so consumers keep the same import path
export type { Habit, Completion, GroupedCompletions };

// ─── Context type ─────────────────────────────────────────────────────────────
interface HabitContextType {
  habits: Habit[] | null;
  todaysHabits: Habit[] | null;
  completedIds: Set<string>;
  completionsReady: boolean;
  historyGrouped: GroupedCompletions | null;
  fetchHistory: (month: Date, habitId?: string) => void;
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

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function HabitProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const todayData = useTodayCompletions(user);
  const habitsData = useHabitsData(
    user,
    todayData.syncAndFetchToday,
    todayData.handleHabitDeleted,
  );
  const historyData = useHistoryData(user);

  useEffect(() => {
    if (!user) {
      console.log("[Habits] effect skipped — no user");
      return;
    }
    console.log("[Habits] effect fired — fetching habits for user:", user.id);
    habitsData.fetchHabits().then((fetched) => {
      console.log("[Habits] fetchHabits resolved, count:", fetched?.length ?? "null");
      todayData.syncAndFetchToday(fetched ?? []);
    }).catch((err) => {
      console.error("[Habits] fetchHabits threw:", err);
    });
  }, [user?.id]);

  return (
    <HabitContext.Provider
      value={{
        habits: habitsData.habits,
        todaysHabits: habitsData.todaysHabits,
        completedIds: todayData.completedIds,
        completionsReady: todayData.completionsReady,
        historyGrouped: historyData.historyGrouped,
        fetchHistory: historyData.fetchHistory,
        createHabit: habitsData.createHabit,
        updateHabit: habitsData.updateHabit,
        deleteHabit: habitsData.deleteHabit,
        toggleCompletion: todayData.toggleCompletion,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHabit() {
  const context = useContext(HabitContext);
  if (context === undefined) throw new Error("Must be inside provider");
  return context;
}
