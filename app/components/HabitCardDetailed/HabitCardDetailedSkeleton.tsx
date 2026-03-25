import { Skeleton } from "@/components/ui/skeleton";

export function HabitCardDetailedSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-4 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0">
        <Skeleton className="size-8 rounded-md shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 min-w-0">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-24" />
          <div className="flex gap-1 mt-3">
            <Skeleton className="h-5 w-9 rounded-md" />
            <Skeleton className="h-5 w-9 rounded-md" />
            <Skeleton className="h-5 w-9 rounded-md" />
          </div>
        </div>
      </div>
      <div className="flex gap-1 shrink-0">
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="size-7 rounded-md" />
      </div>
    </div>
  );
}
