"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowDownToLine, Calendar, CheckCircle2, Clock, IdCard, User2, XCircle } from "lucide-react"

import { type AdminVerificationItem, updateAdminVerificationStatus } from "@/lib/api/verifications"
import { USER_STATUS } from "@/lib/constants"

type VerifyUserDialogProps = {
  request: AdminVerificationItem
  onCompleted?: () => void
}

export function VerifyUserDialog({ request, onCompleted }: VerifyUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [decision, setDecision] = useState<"approve" | "reject">("approve")
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (request.status !== "PendingReview") {
      setOpen(false)
      return
    }

    setIsSubmitting(true)
    setError(null)
    try {
      await updateAdminVerificationStatus(request.userId, {
        isAccepted: decision === "approve",
        reviewerNote: note || undefined,
      })
      setOpen(false)
      setNote("")
      setDecision("approve")
      onCompleted?.()
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Không thể cập nhật trạng thái. Vui lòng thử lại."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon-sm"
          variant="primary"
          aria-label="Verify"
          disabled={request.status !== "PendingReview"}
        >
          <IdCard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl rounded-xl p-6 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Xử lý đơn xác minh</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Kiểm tra thông tin và chọn kết quả xử lý cho người dùng này.
          </p>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <User2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Tên người dùng</div>
                <div className="text-sm text-muted-foreground">{request.user.fullName}</div>
                <div className="text-xs text-muted-foreground">{request.user.phoneNumber}</div>
                <div className="text-xs text-muted-foreground">
                  Role:&nbsp;
                  {request.user.roles?.length
                    ? request.user.roles.join(", ")
                    : "Chưa gán"}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Ngày gửi</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(request.submittedAt).toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-border" />

          <div className="space-y-3 rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Tài liệu đính kèm</span>
              <span className="text-xs text-muted-foreground">
                {request.status === "PendingReview"
                  ? "Chưa duyệt"
                  : request.status === "Approved"
                    ? "Đã chấp nhận"
                    : "Đã từ chối"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {request.documentFrontUrl ? (
                <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                  <a href={request.documentFrontUrl} target="_blank" rel="noopener noreferrer">
                    <ArrowDownToLine className="h-3.5 w-3.5" />
                    Mặt trước
                  </a>
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Mặt trước: —</span>
              )}
              {request.documentBackUrl ? (
                <Button asChild variant="outline" size="sm" className="gap-1 text-xs">
                  <a href={request.documentBackUrl} target="_blank" rel="noopener noreferrer">
                    <ArrowDownToLine className="h-3.5 w-3.5" />
                    Mặt sau
                  </a>
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Mặt sau: —</span>
              )}
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border p-4">
            <Label className="text-sm font-semibold text-foreground">Kết quả xử lý</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDecision("approve")}
                className={`rounded-lg border p-3 text-left text-sm transition ${
                  decision === "approve"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Chấp nhận
                </span>
                <span className="text-xs text-muted-foreground">
                  Đồng ý xác minh người dùng này
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDecision("reject")}
                className={`rounded-lg border p-3 text-left text-sm transition ${
                  decision === "reject"
                    ? "border-danger bg-danger/10 text-danger"
                    : "border-border hover:border-danger/40"
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <XCircle className="h-4 w-4" />
                  Từ chối
                </span>
                <span className="text-xs text-muted-foreground">
                  Không đủ điều kiện hoặc tài liệu chưa hợp lệ
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewer-note" className="text-sm font-medium">
                Ghi chú gửi cho người dùng (không bắt buộc)
              </Label>
              <Textarea
                id="reviewer-note"
                placeholder="Ví dụ: Tài liệu chưa rõ, vui lòng tải ảnh mặt sau..."
                value={note}
                onChange={event => setNote(event.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              <Clock className="h-4 w-4" />
              {error}
            </div>
          )}

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="min-w-28" disabled={isSubmitting}>
                Đóng
              </Button>
            </DialogClose>
            <Button
              variant={decision === "approve" ? "primary" : "destructive"}
              className="min-w-32"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Đang xử lý..." : decision === "approve" ? "Chấp nhận" : "Từ chối"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}


