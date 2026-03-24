"use client";

import { FaCheck } from "react-icons/fa6";
import type { GroupedCompletions } from "@/context/HabitsContext";
import HistoryListSkeleton from "./HistoryListSkeleton";

interface Props {
  grouped: GroupedCompletions | null;
  selectedHabitId: string | null;
  monthLabel: string;
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function HistoryList({
  grouped,
  selectedHabitId,
  monthLabel,
}: Props) {
  if (grouped === null) {
    return <HistoryListSkeleton />;
  }

  if (Object.keys(grouped).length === 0) {
    return (
      <p className="text-sm text-zinc-400">No completions for {monthLabel}.</p>
    );
  }

  return (
    <>
      {Object.entries(grouped).map(([date, completions]) => {
        const total = completions.length;
        const done = completions.filter((c) => c.completed).length;
        const pct = Math.round((done / total) * 100);

        return (
          <div key={date} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                {formatDate(date)}
              </p>
              <span
                className={`text-sm font-semibold ${pct === 100 ? "text-primary" : "text-zinc-400"}`}
              >
                {done}/{total} · {pct}%
              </span>
            </div>

            {selectedHabitId === null && (
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}

            {completions.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm px-4 py-3 flex items-center gap-3"
              >
                {c.completed ? (
                  <div className="w-5 h-5 text-white rounded-full bg-primary flex items-center justify-center shrink-0">
                    <FaCheck aria-label="completed" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
                )}
                <p
                  className={`text-sm font-medium ${c.completed ? "text-foreground" : "text-muted-foreground line-through"}`}
                >
                  {c.habit_name ?? "Unknown habit"}
                </p>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}
