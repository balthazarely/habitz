interface GroupedCompletions {
  [date: string]: { completed: boolean }[];
}

interface Props {
  grouped: GroupedCompletions | null;
  monthLabel: string;
}

export default function MonthStatsCard({ grouped, monthLabel }: Props) {
  if (grouped === null) {
    return (
      <div className="rounded-2xl border bg-card px-5 py-4 flex flex-col gap-3 animate-pulse">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-8 w-16 bg-muted rounded" />
      </div>
    );
  }

  let totalDone = 0;
  let totalScheduled = 0;
  let perfectDays = 0;
  let partialDays = 0;
  let missedDays = 0;

  for (const completions of Object.values(grouped)) {
    const done = completions.filter((c) => c.completed).length;
    const total = completions.length;
    totalDone += done;
    totalScheduled += total;
    if (done === total) perfectDays++;
    else if (done === 0) missedDays++;
    else partialDays++;
  }

  const pct = totalScheduled === 0 ? 0 : Math.round((totalDone / totalScheduled) * 100);

  return (
    <div className="rounded-2xl border bg-card px-5 py-4 flex flex-col gap-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {monthLabel}
      </p>

      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold text-foreground">{pct}%</span>
        <span className="text-sm text-muted-foreground mb-1">
          {totalDone} / {totalScheduled} completed
        </span>
      </div>

      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{perfectDays}</span> perfect
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{partialDays}</span> partial
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{missedDays}</span> missed
          </span>
        </div>
      </div>
    </div>
  );
}
