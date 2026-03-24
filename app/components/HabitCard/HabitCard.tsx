"use client";

import { Habit } from "@/context/HabitsContext";
import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa6";

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
        {habit.emoji && (
          <span className="text-2xl leading-none">{habit.emoji}</span>
        )}
        <div className="flex flex-col gap-1">
          <p
            aria-label="habit-name"
            className={`font-medium transition-colors ${done ? "line-through text-muted-foreground" : "text-foreground"}`}
          >
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
        aria-label="toggle-habit-btn"
        className="rounded-full shrink-0"
      >
        {done && <FaCheck aria-label="completed" />}
      </Button>
    </div>
  );
}
