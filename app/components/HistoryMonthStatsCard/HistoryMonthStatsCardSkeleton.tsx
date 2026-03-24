import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryMonthStatsCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card px-5 py-4 flex flex-col gap-4">
      {/* Month label */}
      <Skeleton className="h-3 w-24" />

      {/* Percentage + completed count */}
      <div className="flex items-end gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-4 w-32 mb-1" />
      </div>

      {/* Progress bar */}
      <Skeleton className="h-2 w-full rounded-full" />

      {/* Perfect / partial / missed pills */}
      <div className="flex gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
