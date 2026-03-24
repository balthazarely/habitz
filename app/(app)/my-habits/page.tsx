"use client";

import { Habit, useHabit } from "@/context/HabitsContext";
import HabitModal from "@/app/components/HabitModal";
import HabitCardDetailed from "@/app/components/HabitCardDetailed";
import PageHeader from "@/app/components/PageHeader";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MyHabitsPage() {
  const { habits, deleteHabit } = useHabit();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  return (
    <div className="max-w-2xl w-full mx-auto px-4 pb-24 md:pb-8 flex flex-col gap-8">
      <PageHeader title="My Habits" action={<HabitModal />} />

      <div className="flex flex-col gap-3">
        {habits === null ? (
          <p className="text-sm text-zinc-400">Loading…</p>
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

      <Dialog
        open={!!deletingHabit}
        onOpenChange={(open) => { if (!open) setDeletingHabit(null); }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete habit</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{deletingHabit?.name}</span>
            ? This cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setDeletingHabit(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await deleteHabit(deletingHabit!.id);
                setDeletingHabit(null);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
