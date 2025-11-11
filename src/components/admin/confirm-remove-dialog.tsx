"use client";

import { useState } from "react"; 
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

type ConfirmRemoveDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  itemType?: string;
  onConfirm: (reason: string) => void;
};

export function ConfirmRemoveDialog({
  open,
  onOpenChange,
  count,
  itemType = "posts",
  onConfirm,
}: ConfirmRemoveDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setReason("");
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent
        className="w-full max-w-md rounded-xl p-6 sm:max-w-md"
        showCloseButton={true}
      >
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-red-600">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
            Confirm Removal
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            You are about to remove{" "}
            <span className="font-medium">
              {count} {itemType}
            </span>
            . This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pt-4">
          <label
            htmlFor="reason"
            className="text-sm font-medium text-foreground"
          >
            Reason for Removal
          </label>
          <Textarea
            id="reason"
            placeholder="Enter the reason for removing these posts..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            This reason will be logged for record keeping.
          </p>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 pt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="min-w-24"
              type="button"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="min-w-24"
            type="button"
            onClick={handleConfirm}
            disabled={!reason.trim()}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}