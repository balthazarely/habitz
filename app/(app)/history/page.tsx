"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/app/components/PageHeader";
import HistoryCalendar from "@/app/components/HistoryCalendar";
import { useAuth } from "@/context/AuthContext";
import { useHabit } from "@/context/HabitsContext";
import { Button } from "@/components/ui/button";
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
    fetchHistory(monthDate, selectedHabitId ?? undefined);
  }, [user?.id, monthDate, selectedHabitId]);

  const monthLabel = monthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="max-w-2xl w-full mx-auto px-4 pb-24 md:pb-8 flex flex-col gap-8">
      <PageHeader title="History" />
      {/* Habit filter pills */}
      <HistoryFilterPils
        habits={habits}
        selectedHabitId={selectedHabitId}
        setSelectedHabitId={setSelectedHabitId}
      />

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
