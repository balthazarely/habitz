import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import { Habit } from "@/context/HabitsContext";
import HabitCardDetailed from "./HabitCardDetailed";

describe("HabitCard", () => {
  it("renders a HabitCard", () => {
    const mockHabit: Habit = {
      id: "2",
      user_id: "user",
      name: "Eat greens",
      description: "Stay healthy",
      frequency: ["Mon", "Tue"],
      emoji: "🥗",
      created_at: "2026-03-24",
    };
    render(
      <HabitCardDetailed
        habit={mockHabit}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText("🥗")).toBeInTheDocument();
    expect(screen.getByText("Eat greens")).toBeInTheDocument();
    expect(screen.getByText("Stay healthy")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
  });

  it("Edit button opens Edit Modal", () => {
    const mockHabit: Habit = {
      id: "2",
      user_id: "user",
      name: "Eat greens",
      description: "Stay healthy",
      frequency: ["Mon", "Tue"],
      emoji: "🥗",
      created_at: "2026-03-24",
    };
    const mockOpenEditModal = jest.fn();

    render(
      <HabitCardDetailed
        habit={mockHabit}
        onEdit={mockOpenEditModal}
        onDelete={jest.fn()}
      />,
    );

    const editButton = screen.getByLabelText("Edit habit");
    const editButtonIcon = screen.getByLabelText("edit-icon");

    fireEvent.click(editButton);

    expect(editButton).toBeInTheDocument();
    expect(editButtonIcon).toBeInTheDocument();
    expect(mockOpenEditModal).toHaveBeenCalledTimes(1);
  });

  it("Delete button opens Delete Modal", () => {
    const mockHabit: Habit = {
      id: "2",
      user_id: "user",
      name: "Eat greens",
      description: "Stay healthy",
      frequency: ["Mon", "Tue"],
      emoji: "🥗",
      created_at: "2026-03-24",
    };
    const mockOpenDeleteModal = jest.fn();

    render(
      <HabitCardDetailed
        habit={mockHabit}
        onEdit={jest.fn()}
        onDelete={mockOpenDeleteModal}
      />,
    );

    const deleteButton = screen.getByLabelText("Delete habit");
    const editButtonIcon = screen.getByLabelText("delete-icon");

    fireEvent.click(deleteButton);

    expect(deleteButton).toBeInTheDocument();
    expect(editButtonIcon).toBeInTheDocument();
    expect(mockOpenDeleteModal).toHaveBeenCalledTimes(1);
  });
});
