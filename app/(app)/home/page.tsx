"use client";

import { useHabit, Habit } from "@/context/HabitsContext";
import PageHeader from "@/app/components/PageHeader/PageHeader";
import HabitCard from "@/app/components/HabitCard/HabitCard";
import TodaySummaryCard from "@/app/components/TodaySummaryCard/TodaySummaryCard";
import { HabitCardSkeleton } from "@/app/components/HabitCard/HabitCardSkeleton";
import { TodaySummaryCardSkeleton } from "@/app/components/TodaySummaryCard/TodaySummaryCardSkeleton";
import confetti from "canvas-confetti";
import EmptyHabitsCard from "@/app/components/EmptyHabitsCard/EmptyHabitsCard";
import AllDoneModal from "@/app/components/AllDoneModal/AllDoneModal";
import { useState } from "react";

export default function HomePage() {
  const { todaysHabits, completedIds, completionsReady, toggleCompletion } =
    useHabit();
  const [showAllDone, setShowAllDone] = useState(false);

  const total = todaysHabits === null ? null : todaysHabits.length;
  const done =
    todaysHabits === null
      ? 0
      : todaysHabits.filter((h) => completedIds.has(h.id)).length;

  return (
    <main className="max-w-2xl w-full mx-auto px-4 pb-24 md:pb-8 flex flex-col gap-4">
      <PageHeader title="Today" />

      {todaysHabits === null || !completionsReady ? (
        <TodaySummaryCardSkeleton />
      ) : (
        <TodaySummaryCard total={total} done={done} />
      )}

      <div className="flex flex-col gap-3">
        {todaysHabits === null || !completionsReady ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <HabitCardSkeleton key={i} />
            ))}
          </div>
        ) : todaysHabits.length === 0 ? (
          <EmptyHabitsCard />
        ) : (
          todaysHabits.map((habit: Habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              done={completedIds.has(habit.id)}
              onToggle={async () => {
                await toggleCompletion(habit.id);
                const nowDone = completedIds.has(habit.id)
                  ? completedIds.size - 1
                  : completedIds.size + 1;
                if (nowDone === todaysHabits.length) {
                  confetti({ particleCount: 160, spread: 120, origin: { y: 0.4 }, zIndex: 100 });
                  setShowAllDone(true);
                }
              }}
            />
          ))
        )}
      </div>
      <AllDoneModal isOpen={showAllDone} onClose={() => setShowAllDone(false)} />
    </main>
  );
}
