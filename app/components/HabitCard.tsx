"use client";

import { Habit } from "@/context/HabitsContext";
import { Button } from "@/components/ui/button";

interface Props {
  habit: Habit;
  done: boolean;
  onToggle: () => void;
}

export default function HabitCard({ habit, done, onToggle }: Props) {
  return (
    <div
      className={`rounded-xl p-4 flex items-center justify-between transition-colors border ${
        done ? "bg-muted border-border" : "bg-card border-border"
      }`}
    >
      <div className="flex items-center gap-3">
        {habit.emoji && <span className="text-2xl leading-none">{habit.emoji}</span>}
        <div className="flex flex-col gap-1">
          <p className={`font-medium transition-colors ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
            {habit.name}
          </p>
          {habit.description && (
            <p className="text-sm text-muted-foreground">{habit.description}</p>
          )}
        </div>
      </div>
      <Button
        variant={done ? "default" : "outline"}
        size="icon"
        onClick={onToggle}
        className="rounded-full shrink-0"
      >
        {done && (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </Button>
    </div>
  );
}
