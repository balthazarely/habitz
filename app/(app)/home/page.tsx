"use client";

import { useHabit, Habit } from "@/context/HabitsContext";
import PageHeader from "@/app/components/PageHeader";
import HabitCard from "@/app/components/HabitCard";
import TodaySummaryCard from "@/app/components/TodaySummaryCard";

export default function HomePage() {
  const { todaysHabits, completedIds, toggleCompletion } = useHabit();

  const total = todaysHabits === null ? null : todaysHabits.length;
  const done =
    todaysHabits === null
      ? 0
      : todaysHabits.filter((h) => completedIds.has(h.id)).length;

  return (
    <main className="max-w-2xl w-full mx-auto px-4 pb-24 md:pb-8 flex flex-col gap-4">
      <PageHeader title="Today" />
      <TodaySummaryCard total={total} done={done} />
      <div className="flex flex-col gap-3">
        {todaysHabits === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
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
