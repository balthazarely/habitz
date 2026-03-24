"use client";

import { Habit, useHabit } from "@/context/HabitsContext";
import HabitModal from "@/app/components/HabitModal";
import HabitCardDetailed from "@/app/components/HabitCardDetailed/HabitCardDetailed";
import PageHeader from "@/app/components/PageHeader";
import { useState } from "react";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import { HabitCardDetailedSkeleton } from "@/app/components/HabitCardDetailed/HabitCardDetailedSkeleton";

export default function MyHabitsPage() {
  const { habits, deleteHabit } = useHabit();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const handleDeleteHabit = async () => {
    await deleteHabit(deletingHabit!.id);
    setDeletingHabit(null);
  };

  return (
    <div className="max-w-2xl w-full mx-auto px-4 pb-24 md:pb-8 flex flex-col gap-8">
      <PageHeader title="My Habits" action={<HabitModal />} />

      <div className="flex flex-col gap-3">
        {habits === null ? (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <HabitCardDetailedSkeleton key={i} />
            ))}
          </>
        ) : habits.length === 0 ? (
          <p className="text-sm text-zinc-400">
            No habits yet. Create one above.
          </p>
        ) : (
          habits.map((habit: Habit) => (
            <HabitCardDetailed
              key={habit.id}
              habit={habit}
              onEdit={() => setEditingHabit(habit)}
              onDelete={() => setDeletingHabit(habit)}
            />
          ))
        )}
      </div>

      {editingHabit && (
        <HabitModal
          habit={editingHabit}
          onClose={() => setEditingHabit(null)}
        />
      )}
      <ConfirmationDialog
        isOpen={!!deletingHabit}
        title="Delete habit"
        text={
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">
              {deletingHabit?.name}
            </span>
            ? This cannot be undone.
          </p>
        }
        cancelText="Cancel"
        proceedText="  Delete"
        cancelAction={() => setDeletingHabit(null)}
        proceedAction={() => handleDeleteHabit()}
      />
    </div>
  );
}
