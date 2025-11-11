"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type MediateComplaintDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (action: string, notes: string) => void;
};

export function MediateComplaintDialog({ open, onOpenChange, onSubmit }: MediateComplaintDialogProps) {
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (action && notes.trim()) {
      onSubmit?.(action, notes);
      setAction("");
      setNotes("");
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setAction("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Mediate Complaint</DialogTitle>
          <p className="text-sm text-muted-foreground pt-2">
            Choose an action and provide notes for the resolution.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Action Field */}
          <div className="space-y-2">
            <label htmlFor="action" className="text-sm font-semibold text-foreground">
              Action
            </label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger id="action" className="w-full">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resolve">Resolve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="escalate">Escalate</SelectItem>
                <SelectItem value="pending">Mark as Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resolution Notes Field */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-semibold text-foreground">
              Resolution Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Enter resolution notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel} type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            onClick={handleSubmit}
            type="button"
            disabled={!action || !notes.trim()}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

