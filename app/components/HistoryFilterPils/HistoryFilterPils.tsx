import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Habit } from "@/hooks/useHabitsData";

interface Props {
  habits: Habit[] | null;
  selectedHabitId: string | null;
  setSelectedHabitId: (arg: string | null) => void;
}

export default function HistoryFilterPils({
  habits,
  selectedHabitId,
  setSelectedHabitId,
}: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
      <Button
        variant={selectedHabitId === null ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedHabitId(null)}
        className="shrink-0 rounded-full"
      >
        All
      </Button>
      {habits === null
        ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full shrink-0" />
          ))
        : habits.map((habit) => (
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
  );
}
