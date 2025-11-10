"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // <-- 1. Thêm import DialogDescription
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

  useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setReason("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md !bg-card">
        <DialogHeader className="text-left space-y-0">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-[hsl(var(--danger))]">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-[hsl(var(--danger))]" />
            <span>Confirm Removal</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-2">
            You are about to remove {count} {itemType}. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label htmlFor="reason" className="text-sm font-semibold text-foreground">
            Reason for Removal
          </label>
          <Textarea
            id="reason"
            placeholder="Enter the reason for removing these posts....."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px] resize-none border-border bg-background"
          />
          <p className="text-xs text-muted-foreground">
            This reason will be logged for record keeping.
          </p>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel} type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            type="button"
            disabled={!reason.trim()}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}