import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import HabitCard from "./HabitCard";
import { Habit } from "@/context/HabitsContext";

describe("HabitCard", () => {
  it("renders a HabitCard", () => {
    const mockHabit: Habit = {
      id: "1",
      user_id: "user",
      name: "Drink water",
      description: "Stay hydrated",
      frequency: ["Mon", "Tue"],
      emoji: "💧",
      created_at: "2026-03-24",
    };
    render(<HabitCard habit={mockHabit} done={false} onToggle={jest.fn()} />);

    expect(screen.getByText("💧")).toBeInTheDocument();
    expect(screen.getByText("Drink water")).toBeInTheDocument();
    expect(screen.getByText("Stay hydrated")).toBeInTheDocument();
  });

  it("shows strikethrough text and checkbox icon if done", () => {
    const mockHabit: Habit = {
      id: "1",
      user_id: "user",
      name: "Drink water",
      description: "Stay hydrated",
      frequency: ["Mon", "Tue"],
      emoji: "💧",
      created_at: "2026-03-24",
    };
    render(<HabitCard habit={mockHabit} done={true} onToggle={jest.fn()} />);

    const habitName = screen.getByText("Drink water");

    expect(habitName).toHaveClass("line-through");
    expect(screen.getByLabelText("completed")).toBeInTheDocument();
  });

  it("shows no strikethrough text and empty icon if not done", () => {
    const mockHabit: Habit = {
      id: "1",
      user_id: "user",
      name: "Drink water",
      description: "Stay hydrated",
      frequency: ["Mon", "Tue"],
      emoji: "💧",
      created_at: "2026-03-24",
    };
    render(<HabitCard habit={mockHabit} done={false} onToggle={jest.fn()} />);

    const habitName = screen.getByText("Drink water");
    expect(habitName).not.toHaveClass("line-through");
    expect(screen.queryByLabelText("completed")).not.toBeInTheDocument();
  });

  it("Button click shuld call onToggle fn - handle mutiple clicks ", () => {
    const mockHabit: Habit = {
      id: "1",
      user_id: "user",
      name: "Drink water",
      description: "Stay hydrated",
      frequency: ["Mon", "Tue"],
      emoji: "💧",
      created_at: "2026-03-24",
    };
    const mockToggle = jest.fn();

    render(<HabitCard habit={mockHabit} done={false} onToggle={mockToggle} />);

    const button = screen.getByLabelText("toggle-habit-btn");
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockToggle).toHaveBeenCalledTimes(2);
  });

  it("don't render anything for description if no description ", () => {
    const mockHabit: Habit = {
      id: "1",
      user_id: "user",
      name: "Drink water",
      description: "",
      frequency: ["Mon", "Tue"],
      emoji: "💧",
      created_at: "2026-03-24",
    };
    render(<HabitCard habit={mockHabit} done={false} onToggle={jest.fn()} />);

    expect(screen.queryByText("Stay hydrated")).not.toBeInTheDocument();
  });
});
