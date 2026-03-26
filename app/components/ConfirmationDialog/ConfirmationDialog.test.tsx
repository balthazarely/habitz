import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import ConfirmationDialog from "./ConfirmationDialog";

describe("ConfirmationDialog", () => {
  it("renders dialog if isOpen", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Delete Habit"
        text={<p>Are you sure you want to delete this habit?</p>}
        cancelText="Cancel"
        proceedText="Delete"
        cancelAction={() => {}}
        proceedAction={() => {}}
      />,
    );

    expect(screen.getByLabelText("dialog content")).toBeInTheDocument();
  });
  it("hides dialog if !isOpen", () => {
    render(
      <ConfirmationDialog
        isOpen={false}
        title="Delete Habit"
        text={<p>Are you sure you want to delete this habit?</p>}
        cancelText="Cancel"
        proceedText="Delete"
        cancelAction={() => {}}
        proceedAction={() => {}}
      />,
    );

    expect(screen.queryByLabelText("dialog content")).not.toBeInTheDocument();
  });
  it("renders the text passed into the dialog if open", () => {
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Delete Habit"
        text={<p>Are you sure you want to delete this habit?</p>}
        cancelText="Cancel"
        proceedText="Delete"
        cancelAction={() => {}}
        proceedAction={() => {}}
      />,
    );

    expect(
      screen.getByText("Are you sure you want to delete this habit?"),
    ).toBeInTheDocument();
    expect(screen.getByText("Delete Habit")).toBeInTheDocument();
  });

  it("Cancel/proceed buttons should fire their actions", () => {
    const mockCancelBtn = jest.fn();
    const mockProceedBtn = jest.fn();
    render(
      <ConfirmationDialog
        isOpen={true}
        title="Delete Habit"
        text={<p>Are you sure you want to delete this habit?</p>}
        cancelText="Cancel"
        proceedText="Delete"
        cancelAction={mockCancelBtn}
        proceedAction={mockProceedBtn}
      />,
    );
    const cancelBtn = screen.getByLabelText("cancel btn");
    const proceedBtn = screen.getByLabelText("proceed btn");
    fireEvent.click(cancelBtn);
    fireEvent.click(proceedBtn);
    expect(mockCancelBtn).toHaveBeenCalled();
    expect(mockProceedBtn).toHaveBeenCalled();
  });
});
