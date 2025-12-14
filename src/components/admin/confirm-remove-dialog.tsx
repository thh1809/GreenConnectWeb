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
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-danger">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-danger" />
            Xác nhận xóa
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Bạn sắp xóa{" "}
            <span className="font-medium">
              {count} {itemType === 'posts' ? 'bài đăng' : itemType}
            </span>
            . Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pt-4">
          <label
            htmlFor="reason"
            className="text-sm font-medium text-popover-foreground"
          >
            Lý do xóa
          </label>
          <Textarea
            id="reason"
            placeholder="Nhập lý do xóa các bài đăng này..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Lý do này sẽ được ghi lại để lưu trữ.
          </p>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 pt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="min-w-24"
              type="button"
            >
              Hủy
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            className="min-w-24"
            type="button"
            onClick={handleConfirm}
            disabled={!reason.trim()}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
