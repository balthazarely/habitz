"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/app/components/PageHeader";
import HistoryCalendar from "@/app/components/HistoryCalendar";
import MonthStatsCard from "@/app/components/MonthStatsCard";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { useHabit } from "@/context/HabitsContext";
import { Button } from "@/components/ui/button";

interface Completion {
  id: string;
  habit_id: string | null;
  habit_name: string | null;
  completed_on: string;
  completed: boolean;
}

interface GroupedCompletions {
  [date: string]: Completion[];
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

async function fetchMonth(userId: string, month: Date, habitId?: string) {
  const year = month.getFullYear();
  const m = month.getMonth() + 1;
  const first = `${year}-${String(m).padStart(2, "0")}-01`;
  const lastDay = new Date(year, m, 0).getDate();
  const last = `${year}-${String(m).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  let query = supabase
    .from("habit_completions")
    .select("id, habit_id, habit_name, completed_on, completed")
    .eq("user_id", userId)
    .gte("completed_on", first)
    .lte("completed_on", last)
    .order("completed_on", { ascending: false });

  if (habitId) query = query.eq("habit_id", habitId);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).reduce<GroupedCompletions>((acc, c) => {
    if (!acc[c.completed_on]) acc[c.completed_on] = [];
    acc[c.completed_on].push(c);
    return acc;
  }, {});
}

export default function HistoryPage() {
  const { user, isLoading } = useAuth();
  const { habits } = useHabit();
  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [grouped, setGrouped] = useState<GroupedCompletions | null>(null);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading || !user) return;
    let cancelled = false;
    setGrouped(null);
    fetchMonth(user.id, monthDate, selectedHabitId ?? undefined)
      .then((data) => { if (!cancelled) setGrouped(data); })
      .catch(() => { if (!cancelled) setGrouped({}); });
    return () => { cancelled = true; };
  }, [user?.id, isLoading, monthDate, selectedHabitId]);

  const dayStatuses = useMemo(() => {
    if (!grouped) return {};
    const result: Record<string, "full" | "partial" | "none"> = {};
    for (const [date, completions] of Object.entries(grouped)) {
      const done = completions.filter((c) => c.completed).length;
      const total = completions.length;
      result[date] = done === total ? "full" : done === 0 ? "none" : "partial";
    }
    return result;
  }, [grouped]);

  const monthLabel = monthDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <main className="max-w-2xl w-full mx-auto px-4 pb-24 md:pb-8 flex flex-col gap-8">
      <PageHeader title="History" />

      {/* Habit filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        <Button
          variant={selectedHabitId === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedHabitId(null)}
          className="shrink-0 rounded-full"
        >
          All
        </Button>
        {(habits ?? []).map((habit) => (
          <Button
            key={habit.id}
            variant={selectedHabitId === habit.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedHabitId(habit.id)}
            className="shrink-0 rounded-full"
          >
            {habit.name}
          </Button>
        ))}
      </div>

      <MonthStatsCard grouped={grouped} monthLabel={monthLabel} />

      <HistoryCalendar
        month={monthDate}
        onMonthChange={(d) => setMonthDate(new Date(d.getFullYear(), d.getMonth(), 1))}
        dayStatuses={dayStatuses}
      />

      {grouped === null ? (
        <p className="text-sm text-zinc-400">Loading…</p>
      ) : Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-zinc-400">No completions for {monthLabel}.</p>
      ) : (
        Object.entries(grouped).map(([date, completions]) => {
          const total = completions.length;
          const done = completions.filter((c) => c.completed).length;
          const pct = Math.round((done / total) * 100);

          return (
            <div key={date} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
                  {formatDate(date)}
                </p>
                <span className={`text-sm font-semibold ${pct === 100 ? "text-primary" : "text-zinc-400"}`}>
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
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
                  )}
                  <p className={`text-sm font-medium ${c.completed ? "text-foreground" : "text-muted-foreground line-through"}`}>
                    {c.habit_name ?? "Unknown habit"}
                  </p>
                </div>
              ))}
            </div>
          );
        })
      )}
    </main>
  );
}
