"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

type MediateComplaintDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (isAccept: boolean, notes: string) => void;
};

export function MediateComplaintDialog({ open, onOpenChange, onSubmit }: MediateComplaintDialogProps) {
  const [action, setAction] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (action && notes.trim()) {
      setIsSubmitting(true);
      setError(null);
      
      try {
        const isAccept = action === "accept";
        await onSubmit?.(isAccept, notes);
        setAction("");
        setNotes("");
        onOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process complaint");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setAction("");
    setNotes("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="w-full max-h-[90vh] overflow-y-auto sm:max-w-2xl overflow-x-visible bg-card">
        <DialogHeader className="space-y-3 pb-4">
          <DialogTitle className="text-2xl font-bold">Xử lý khiếu nại</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Chọn quyết định và nhập ghi chú để xử lý khiếu nại này.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Action Field */}
          <div className="space-y-3">
            <label htmlFor="action" className="text-base font-semibold text-foreground">
              Quyết định (Decision) <span className="text-danger">*</span>
            </label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger id="action" className="w-full h-12 text-base bg-background border border-input">
                <SelectValue placeholder="Chọn quyết định" />
              </SelectTrigger>
              <SelectContent 
                className="z-[10000] w-[var(--radix-select-trigger-width)] bg-popover border border-border shadow-lg" 
                position="popper"
                sideOffset={8}
              >
                <SelectItem value="accept" className="py-3 text-base">
                  <span className="font-semibold text-primary">Chấp thuận (Accept)</span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    Khiếu nại đúng, xử phạt người bị tố cáo
                  </span>
                </SelectItem>
                <SelectItem value="reject" className="py-3 text-base">
                  <span className="font-semibold text-danger">Từ chối (Reject)</span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    Khiếu nại sai, không đủ bằng chứng
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resolution Notes Field */}
          <div className="space-y-3">
            <label htmlFor="notes" className="text-base font-semibold text-foreground">
              Ghi chú xử lý (Reviewer Note) <span className="text-danger">*</span>
            </label>
            <Textarea
              id="notes"
              placeholder="Nhập ghi chú xử lý chi tiết..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[160px] resize-none text-base bg-background border border-input"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-end gap-3 pt-6 border-t">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              type="button" 
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              Hủy
            </Button>
          </DialogClose>
          <Button
            variant="default"
            onClick={handleSubmit}
            type="button"
            disabled={!action || !notes.trim() || isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Đang xử lý...
              </>
            ) : (
              "Xử lý"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

