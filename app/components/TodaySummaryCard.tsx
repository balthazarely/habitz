"use client";

import { useAuth } from "@/context/AuthContext";

interface Props {
  total: number | null;
  done: number;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function statusMessage(done: number, total: number) {
  if (total === 0) return "No habits scheduled for today.";
  if (done === 0) return "You haven't started yet — let's go!";
  if (done === total) return "All done for today. Great work!";
  const left = total - done;
  return `${left} habit${left === 1 ? "" : "s"} left to go.`;
}

export default function TodaySummaryCard({ total, done }: Props) {
  const { user } = useAuth();

  const isLoading = total === null;
  const safeTotal = total ?? 0;
  const pct = safeTotal === 0 ? 0 : Math.round((done / safeTotal) * 100);
  const allDone = safeTotal > 0 && done === safeTotal;

  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col gap-4 transition-colors ${allDone ? "bg-primary border-primary" : "bg-card border-border"}`}
    >
      <div className="flex flex-col gap-1">
        <p
          className={`text-lg font-bold ${allDone ? "text-primary-foreground" : "text-foreground"}`}
        >
          {greeting()}
          {user?.first_name ? `, ${user.first_name}` : ""}!
        </p>
        <p
          className={`text-sm ${allDone ? "text-primary-foreground/80" : "text-muted-foreground"}`}
        >
          {isLoading ? "Loading your habits…" : statusMessage(done, safeTotal)}
        </p>
      </div>

      {!isLoading && safeTotal > 0 && (
        <>
          <div
            className={`h-2 w-full rounded-full overflow-hidden ${allDone ? "bg-primary-foreground/20" : "bg-muted"}`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-primary-foreground" : "bg-primary"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p
            className={`text-xs font-medium tabular-nums ${allDone ? "text-primary-foreground/80" : "text-muted-foreground"}`}
          >
            {done} / {safeTotal} completed · {pct}%
          </p>
        </>
      )}
    </div>
  );
}
