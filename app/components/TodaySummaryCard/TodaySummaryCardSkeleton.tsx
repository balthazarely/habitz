import { Skeleton } from "@/components/ui/skeleton";

export function TodaySummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-5 w-36" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-4 w-32 " />
    </div>
  );
}
