import "@testing-library/jest-dom";
import { act, renderHook } from "@testing-library/react";
import { Habit } from "@/context/HabitsContext";
import { User } from "@/context/AuthContext";
import { useHabitsData } from "./useHabitsData";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

jest.mock("@/lib/supabaseClient", () => ({
  supabase: { from: jest.fn() },
}));

jest.mock("@/lib/today", () => ({
  todayShort: "Mon", // consistent, predictable
  todayDate: "2024-01-01", // consistent, predictable
}));

jest.mock("sonner", () => ({ toast: jest.fn() }));

const fakeHabit: Habit = {
  id: "2",
  user_id: "2",
  name: "Go hiking",
  description: "Enjoy the outdoors",
  frequency: ["Mon", "Fri"],
  emoji: "😎",
  created_at: "123123124124",
};

const fakeHabit2: Habit = {
  id: "2",
  user_id: "2",
  name: "Go hiking",
  description: "Enjoy the outdoors",
  frequency: ["Fri"],
  emoji: "😎",
  created_at: "123123124124",
};

const fakeUser: User = {
  id: "2",
  first_name: "benathin",
  last_name: "tingles",
  email: "user@gmail.com",
  theme: "light",
};
const mockFrom = supabase.from as jest.Mock;

describe("useHabitsData ", () => {
  const mockSyncToday = jest.fn().mockResolvedValue(undefined);
  const mockOnHabitDeleted = jest.fn();

  it("habits should be null before fetchHabits is called", () => {
    const { result } = renderHook(() =>
      useHabitsData(fakeUser, mockSyncToday, mockOnHabitDeleted),
    );

    expect(result.current.habits).toBeNull();
  });

  it("Should return habits when fetchHabits is called", async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [fakeHabit], error: null }),
    });

    const { result } = renderHook(() =>
      useHabitsData(fakeUser, mockSyncToday, mockOnHabitDeleted),
    );

    await act(async () => {
      await result.current.fetchHabits();
    });

    expect(result.current.habits).toEqual([fakeHabit]);
  });

  it("Should return today's habits when todaysHabits is called", async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [fakeHabit], error: null }),
    });

    const { result } = renderHook(() =>
      useHabitsData(fakeUser, mockSyncToday, mockOnHabitDeleted),
    );

    await act(async () => {
      await result.current.fetchHabits();
    });

    expect(result.current.todaysHabits).toEqual([fakeHabit]);
  });

  it("Should not return today's habits when todaysHabits is called if day isnt monday", async () => {
    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [fakeHabit2], error: null }),
    });

    const { result } = renderHook(() =>
      useHabitsData(fakeUser, mockSyncToday, mockOnHabitDeleted),
    );

    await act(async () => {
      await result.current.fetchHabits();
    });

    expect(result.current.todaysHabits).toEqual([]);
  });

  it("Should created a habit when createHabit is called", async () => {
    const createdHabit = {
      name: "Go hiking",
      description: "Enjoy the outdoors",
      frequency: ["Mon", "Fri"],
      emoji: "😎",
      user_id: "2",
    };

    mockFrom.mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: createdHabit, error: null }),
    });

    const { result } = renderHook(() =>
      useHabitsData(fakeUser, mockSyncToday, mockOnHabitDeleted),
    );

    await act(async () => {
      await result.current.createHabit(
        "Go hiking",
        "Enjoy the outdoors",
        ["Mon", "Fri"],
        "😎",
      );
    });

    expect(result.current.habits).toEqual([createdHabit]);
    expect(toast).toHaveBeenCalledWith("Habit created!", expect.any(Object));
  });

  it("Should update a habit when updateHabit is called", async () => {
    const currentHabit = {
      id: "12",
      name: "Go hiking",
      description: "Enjoy the outdoors",
      frequency: ["Mon", "Fri"],
      emoji: "😎",
      user_id: "2",
    };

    const updatedHabit = {
      id: "12",
      name: "Go hiking with GF",
      description: "Enjoy the outdoors with her",
      frequency: ["Mon", "Fri", "Sat"],
      emoji: "😎",
      user_id: "2",
    };

    mockFrom.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [currentHabit], error: null }),
    });

    const { result } = renderHook(() =>
      useHabitsData(fakeUser, mockSyncToday, mockOnHabitDeleted),
    );

    await act(async () => {
      await result.current.fetchHabits();
    });

    mockFrom.mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: updatedHabit, error: null }),
    });

    await act(async () => {
      await result.current.updateHabit(
        "12",
        "Go hiking with GF",
        "Enjoy the outdoors with her",
        ["Mon", "Fri", "Sat"],
        "😎",
      );
    });

    expect(result.current.habits).toEqual([updatedHabit]);
    expect(toast).toHaveBeenCalledWith("Habit updated!", expect.any(Object));
  });

  it("Should delete a habit when deleteHabit is called", async () => {
    const currentHabit = {
      id: "12",
      name: "Go hiking",
      description: "Enjoy the outdoors",
      frequency: ["Mon", "Fri"],
      emoji: "😎",
      user_id: "2",
    };

    mockFrom.mockReturnValue({
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [currentHabit], error: null }),
    });

    const { result } = renderHook(() =>
      useHabitsData(fakeUser, mockSyncToday, mockOnHabitDeleted),
    );

    await act(async () => {
      await result.current.deleteHabit("12");
    });

    expect(result.current.habits).toEqual([]);
    expect(toast).toHaveBeenCalledWith("Habit deleted!", expect.any(Object));
  });
});
