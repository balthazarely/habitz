import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function HabitCardSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between gap-2">
        <div className="flex gap-3">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3  w-42" />
          </div>
        </div>
        <Skeleton className="size-10 shrink-0 rounded-full" />
      </CardHeader>
    </Card>
  );
}
