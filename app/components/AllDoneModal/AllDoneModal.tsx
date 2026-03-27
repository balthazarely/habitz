import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AllDoneModal({ isOpen, onClose }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl">You did it! 🎉</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          You've completed all your habits for today. Keep up the great work!
        </p>
        <Button onClick={onClose} className="mt-2 w-full">
          Thanks!
        </Button>
      </DialogContent>
    </Dialog>
  );
}
