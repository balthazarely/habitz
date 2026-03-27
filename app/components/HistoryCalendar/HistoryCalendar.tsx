"use client";

import { useMemo } from "react";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import type { GroupedCompletions } from "@/context/HabitsContext";
import type { DayButton } from "react-day-picker";

type DayStatus = "full" | "partial" | "none";

interface Props {
  month: Date;
  onMonthChange: (date: Date) => void;
  grouped: GroupedCompletions | null;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const dotColor: Record<DayStatus, string> = {
  full: "bg-green-500",
  partial: "bg-yellow-400",
  none: "bg-red-400",
};

export default function HistoryCalendar({ month, onMonthChange, grouped }: Props) {
  const dayStatuses = useMemo(() => {
    if (!grouped) return {};
    const result: Record<string, DayStatus> = {};
    for (const [date, completions] of Object.entries(grouped)) {
      const done = completions.filter((c) => c.completed).length;
      const total = completions.length;
      result[date] = done === total ? "full" : done === 0 ? "none" : "partial";
    }
    return result;
  }, [grouped]);

  return (
    <Calendar
      mode="single"
      month={month}
      onMonthChange={onMonthChange}
      hideNavigation
      className="rounded-lg border w-full"
      components={{
        DayButton: ({ day, modifiers, children, ...props }: React.ComponentProps<typeof DayButton>) => {
          const status = dayStatuses[dateKey(day.date)];
          return (
            <CalendarDayButton day={day} modifiers={modifiers} {...props}>
              {children}
              {status ? (
                <span className={`w-1.5 h-1.5 rounded-full mx-auto ${dotColor[status]}`} />
              ) : (
                <span className="w-1.5 h-1.5" />
              )}
            </CalendarDayButton>
          );
        },
      }}
    />
  );
}
