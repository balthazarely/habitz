"use client";

import { Habit } from "@/context/HabitsContext";
import { Button } from "@/components/ui/button";
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";

interface Props {
  habit: Habit;
  onEdit: () => void;
  onDelete: () => void;
}

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitCardDetailed({ habit, onEdit, onDelete }: Props) {
  const sortedFrequency = [...habit.frequency].sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b),
  );

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        {habit.emoji && (
          <span className="text-2xl leading-none shrink-0 mt-0.5">
            {habit.emoji}
          </span>
        )}

        <div className="flex flex-col gap-1 min-w-0">
          <p className="font-medium text-zinc-900 dark:text-white">
            {habit.name}
          </p>
          {habit.description && (
            <p className="text-sm text-zinc-500">{habit.description}</p>
          )}
          <div className="flex gap-1 flex-wrap mt-3">
            {sortedFrequency.map((day) => (
              <span
                key={day}
                className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-md"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onEdit}
          aria-label="Edit habit"
        >
          <FaPencil aria-label="edit-icon" />
        </Button>
        <Button
          variant="destructive"
          size="icon-sm"
          onClick={onDelete}
          aria-label="Delete habit"
        >
          <FaRegTrashCan aria-label="delete-icon" />
        </Button>
      </div>
    </div>
  );
}
