import { useCallback, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@/context/AuthContext";

export interface Completion {
  id: string;
  habit_id: string | null;
  habit_name: string | null;
  completed_on: string;
  completed: boolean;
}

export interface GroupedCompletions {
  [date: string]: Completion[];
}

async function fetchMonth(userId: string, month: Date, habitId?: string): Promise<GroupedCompletions> {
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

export function useHistoryData(user: User | null) {
  const [historyGrouped, setHistoryGrouped] = useState<GroupedCompletions | null>(null);
  const userRef = useRef(user);
  userRef.current = user;
  const historySeqRef = useRef(0);

  const fetchHistory = useCallback((month: Date, habitId?: string) => {
    if (!userRef.current) return;
    const seq = ++historySeqRef.current;
    setHistoryGrouped(null);
    fetchMonth(userRef.current.id, month, habitId)
      .then((data) => { if (historySeqRef.current === seq) setHistoryGrouped(data); })
      .catch(() => { if (historySeqRef.current === seq) setHistoryGrouped({}); });
  }, []);

  return { historyGrouped, fetchHistory };
}
