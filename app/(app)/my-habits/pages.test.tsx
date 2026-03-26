import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import MyHabitsPage from "./page";
import { Habit, useHabit } from "@/context/HabitsContext";

jest.mock("@/context/HabitsContext", () => ({
  useHabit: jest.fn(),
}));

jest.mock(
  "@/app/components/HabitCardDetailed/HabitCardDetailed",
  () =>
    ({ habit, onDelete, onEdit }: any) => {
      return (
        <>
          <div>{habit.emoji}</div>
          <p>{habit.name}</p>
          <p>{habit.description}</p>
          <button onClick={onEdit}>Edit Habit</button>
          <button onClick={onDelete}>Delete Habit</button>
        </>
      );
    },
);

const mockUseHabit = useHabit as jest.Mock;

describe("My Habits Page ", () => {
  const fakeHabit: Habit[] = [
    {
      id: "2",
      user_id: "2",
      name: "Go hiking",
      description: "Enjoy the outdoors",
      frequency: ["Mon", "Fri"],
      emoji: "😎",
      created_at: "123123124124",
    },
  ];

  beforeEach(() => {
    mockUseHabit.mockReturnValue({
      habits: fakeHabit,
      deleteHabit: jest.fn(),
    });
  });

  it("should render both habits as cards", () => {
    render(<MyHabitsPage />);

    expect(screen.queryByText("Go hiking")).toBeInTheDocument();
    expect(screen.queryByText("Enjoy the outdoors")).toBeInTheDocument();
    expect(screen.queryByText("😎")).toBeInTheDocument();
  });

  it("should render skeleton loader if habits is null", () => {
    mockUseHabit.mockReturnValue({
      habits: null,
    });

    render(<MyHabitsPage />);
    expect(screen.getByLabelText("skeleton")).toBeInTheDocument();
  });

  it("should render 'No habits yet' when there are no habits", () => {
    mockUseHabit.mockReturnValue({
      habits: [],
    });

    render(<MyHabitsPage />);
    expect(screen.getByText("No habits yet")).toBeInTheDocument();
  });

  it("should show confirmation dialog when delete is clicked", () => {
    render(<MyHabitsPage />);

    // Dialog should be closed initially
    expect(screen.queryByText("Delete habit")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete Habit"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete habit")).toBeInTheDocument();
    expect(screen.getByLabelText("proceed btn")).toBeInTheDocument();
    expect(screen.getByLabelText("cancel btn")).toBeInTheDocument();
  });

  it("should show Habit Modal dialog when edit is clicked", () => {
    render(<MyHabitsPage />);

    // Dialog should be closed initially
    expect(screen.queryByText("Edit habit")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Edit Habit"));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Edit habit")).toBeInTheDocument();
    expect(screen.getByText("Save changes")).toBeInTheDocument();
  });
});
