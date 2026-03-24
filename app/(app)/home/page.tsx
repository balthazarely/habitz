"use client";

import { useHabit, Habit } from "@/context/HabitsContext";
import PageHeader from "@/app/components/PageHeader/PageHeader";
import HabitCard from "@/app/components/HabitCard/HabitCard";
import TodaySummaryCard from "@/app/components/TodaySummaryCard/TodaySummaryCard";
import { HabitCardSkeleton } from "@/app/components/HabitCard/HabitCardSkeleton";
import { TodaySummaryCardSkeleton } from "@/app/components/TodaySummaryCard/TodaySummaryCardSkeleton";

export default function HomePage() {
  const { todaysHabits, completedIds, completionsReady, toggleCompletion } =
    useHabit();

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
          <p className="text-sm text-muted-foreground">No habits yet.</p>
        ) : (
          todaysHabits.map((habit: Habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              done={completedIds.has(habit.id)}
              onToggle={() => toggleCompletion(habit.id)}
            />
          ))
        )}
      </div>
    </main>
  );
}
