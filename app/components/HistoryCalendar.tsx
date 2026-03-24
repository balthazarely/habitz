"use client";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import type { DayButton } from "react-day-picker";

type DayStatus = "full" | "partial" | "none";

interface Props {
  month: Date;
  onMonthChange: (date: Date) => void;
  dayStatuses: Record<string, DayStatus>;
}

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const dotColor: Record<DayStatus, string> = {
  full: "bg-green-500",
  partial: "bg-yellow-400",
  none: "bg-red-400",
};

export default function HistoryCalendar({ month, onMonthChange, dayStatuses }: Props) {
  return (
    <Calendar
      mode="single"
      month={month}
      onMonthChange={onMonthChange}
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
