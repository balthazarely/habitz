"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/components/PageHeader/PageHeader";
import HistoryCalendar from "@/app/components/HistoryCalendar/HistoryCalendar";
import { useAuth } from "@/context/AuthContext";
import { useHabit } from "@/context/HabitsContext";
import HistoryMonthStatsCard from "@/app/components/HistoryMonthStatsCard/HistoryMonthStatsCard";
import HistoryFilterPils from "@/app/components/HistoryFilterPils/HistoryFilterPils";
import HistoryList from "@/app/components/HistoryList/HistoryList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HistoryPage() {
  const { user } = useAuth();
  const { habits, historyGrouped, fetchHistory } = useHabit();
  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchHistory(user.id, monthDate, selectedHabitId ?? undefined);
  }, [user?.id, monthDate, selectedHabitId]);

  const monthLabel = monthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="max-w-2xl w-full mx-auto px-4 pb-24 md:pb-8 flex flex-col gap-8">
      <PageHeader title="History" />
      <HistoryFilterPils
        habits={habits}
        selectedHabitId={selectedHabitId}
        setSelectedHabitId={setSelectedHabitId}
      />
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, 1))}
          className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-medium w-32 text-center">{monthLabel}</span>
        <button
          onClick={() => setMonthDate(new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1))}
          className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <HistoryMonthStatsCard grouped={historyGrouped} monthLabel={monthLabel} />
      <Accordion>
        <AccordionItem value="calendar" className="border-none">
          <AccordionTrigger className="text-sm font-semibold text-muted-foreground uppercase tracking-wide py-0 pb-3">
            Calendar
          </AccordionTrigger>
          <AccordionContent>
            <HistoryCalendar
              month={monthDate}
              onMonthChange={(d) =>
                setMonthDate(new Date(d.getFullYear(), d.getMonth(), 1))
              }
              grouped={historyGrouped}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <HistoryList
        grouped={historyGrouped}
        selectedHabitId={selectedHabitId}
        monthLabel={monthLabel}
      />
    </main>
  );
}
