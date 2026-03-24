import { Skeleton } from "@/components/ui/skeleton";

function SkeletonDay() {
  return (
    <div className="flex flex-col gap-3">
      {/* Date + percentage */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-36" />
        <Skeleton className="h-3.5 w-16" />
      </div>

      {/* Progress bar */}
      <Skeleton className="h-1.5 w-full rounded-full" />

      {/* Completion rows */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm px-4 py-3 flex items-center gap-3"
        >
          <Skeleton className="w-5 h-5 rounded-full shrink-0" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

export default function HistoryListSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonDay key={i} />
      ))}
    </>
  );
}
