"use client";

import { Habit, useHabit } from "@/context/HabitsContext";
import HabitModal from "@/app/components/HabitModal/HabitModal";
import HabitCardDetailed from "@/app/components/HabitCardDetailed/HabitCardDetailed";
import PageHeader from "@/app/components/PageHeader/PageHeader";
import { useState } from "react";
import ConfirmationDialog from "@/app/components/ConfirmationDialog/ConfirmationDialog";
import { HabitCardDetailedSkeleton } from "@/app/components/HabitCardDetailed/HabitCardDetailedSkeleton";
import EmptyHabitsCard from "@/app/components/EmptyHabitsCard/EmptyHabitsCard";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableHabitCard({
  habit,
  onEdit,
  onDelete,
}: {
  habit: Habit;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: habit.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={isDragging ? "opacity-50" : ""}
    >
      <HabitCardDetailed
        habit={habit}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export default function MyHabitsPage() {
  const { habits, deleteHabit, updateHabitOrder, setHabits } = useHabit();
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [deletingHabit, setDeletingHabit] = useState<Habit | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !habits) return;
    const oldIndex = habits.findIndex((h) => h.id === active.id);
    const newIndex = habits.findIndex((h) => h.id === over.id);
    const reordered = arrayMove(habits, oldIndex, newIndex);
    setHabits(reordered);
    updateHabitOrder(reordered.map((h) => h.id));
  };

  const handleDeleteHabit = async () => {
    await deleteHabit(deletingHabit!.id);
    setDeletingHabit(null);
  };

  return (
    <div className="max-w-2xl w-full mx-auto px-4 pb-24 md:pb-8 flex flex-col gap-8">
      <PageHeader title="My Habits" action={<HabitModal />} />

      <div className="flex flex-col gap-3">
        {habits === null ? (
          <div aria-label="skeleton" className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <HabitCardDetailedSkeleton key={i} />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <EmptyHabitsCard />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={habits.map((h) => h.id)} strategy={verticalListSortingStrategy}>
              {habits.map((habit) => (
                <SortableHabitCard
                  key={habit.id}
                  habit={habit}
                  onEdit={() => setEditingHabit(habit)}
                  onDelete={() => setDeletingHabit(habit)}
                />
              ))}
            </SortableContext>
          </DndContext>
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
        proceedText="Delete"
        cancelAction={() => setDeletingHabit(null)}
        proceedAction={() => handleDeleteHabit()}
      />
    </div>
  );
}
