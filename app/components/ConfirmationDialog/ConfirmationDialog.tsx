import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface Props {
  isOpen: boolean;
  title: string;
  text: ReactNode;
  cancelText: string;
  proceedText: string;
  cancelAction: () => void;
  proceedAction: () => void;
}

export default function ConfirmationDialog({
  isOpen,
  title,
  text,
  cancelText,
  proceedText,
  cancelAction,
  proceedAction,
}: Props) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) cancelAction();
      }}
    >
      <DialogContent aria-label="dialog content">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {text}
        <div className="flex gap-3 justify-end">
          <Button
            aria-label="cancel btn"
            variant="ghost"
            onClick={() => cancelAction()}
          >
            {cancelText}
          </Button>
          <Button
            aria-label="proceed btn"
            variant="destructive"
            onClick={async () => proceedAction()}
          >
            {proceedText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
