'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import {
  getAdminVerifications,
  type AdminVerificationItem,
  type AdminVerificationStatus,
} from '@/lib/api/verifications'
import { VerifyUserDialog } from '@/page/admin/components/verify-user-dialog'
import { AlertCircle, Search, ChevronLeft, ChevronRight, Clock8, CheckCircle2, XCircle, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const PAGE_SIZE = 10
const statusOptions: { label: string; value: 'all' | AdminVerificationStatus }[] = [
  { label: 'Tất cả trạng thái', value: 'all' },
  { label: 'Pending Review', value: 'PendingReview' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
]

const statusBadgeStyles: Record<AdminVerificationStatus, string> = {
  PendingReview: 'bg-warning/20 text-warning-update',
  Approved: 'bg-primary text-primary-foreground',
  Rejected: 'bg-danger text-white',
}

const statusIconMap: Record<AdminVerificationStatus, JSX.Element> = {
  PendingReview: <Clock8 className="h-3.5 w-3.5" />,
  Approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  Rejected: <XCircle className="h-3.5 w-3.5" />,
}

export default function CollectorPage() {
  const [verifications, setVerifications] = useState<AdminVerificationItem[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | AdminVerificationStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedVerification, setSelectedVerification] = useState<AdminVerificationItem | null>(null)

  const fetchVerifications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getAdminVerifications({
        pageNumber: page,
        pageSize: PAGE_SIZE,
        sortBySubmittedAt: true,
      })
      setVerifications(response.data)
      setTotalRecords(response.pagination.totalRecords)
      setTotalPages(response.pagination.totalPages)
      setNextPage(response.pagination.nextPage)
      setPrevPage(response.pagination.prevPage)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Không thể tải danh sách đơn xác minh. Vui lòng thử lại.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVerifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, refreshToken])

  const filteredVerifications = useMemo(() => {
    let filtered = verifications

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        item =>
          item.user.fullName.toLowerCase().includes(query) ||
          item.user.phoneNumber.includes(query),
      )
    }

    return filtered
  }, [verifications, statusFilter, searchQuery])

  const formatSubmittedAt = (dateString: string) => {
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? '—'
      : date.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleOpenDetailDialog = (verification: AdminVerificationItem) => {
    setSelectedVerification(verification)
    setDetailDialogOpen(true)
  }

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false)
    setSelectedVerification(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Collector</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý đơn xác minh người thu gom
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn xác minh</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <input
                placeholder="Tìm theo tên hoặc số điện thoại"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  setPage(1) // Reset về trang 1 khi search
                }}
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={value => setStatusFilter(value as typeof statusFilter)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Spinner className="mr-3 h-5 w-5" />
              Đang tải dữ liệu...
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          ) : (
            <>
              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên / Điện thoại</TableHead>
                    <TableHead>Hạng</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày gửi</TableHead>
                    <TableHead className="w-[180px] text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVerifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                        Không có đơn xác minh phù hợp bộ lọc hiện tại.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVerifications.map(item => (
                      <TableRow key={item.userId}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{item.user.fullName}</span>
                            <span className="text-xs text-muted-foreground">{item.user.phoneNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.user.rank}</TableCell>
                        <TableCell>
                          {item.user.roles?.length ? (
                            <div className="flex flex-wrap gap-1">
                              {item.user.roles.map(role => (
                                <span
                                  key={role}
                                  className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Chưa gán</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeStyles[item.status]}`}
                          >
                            {statusIconMap[item.status]}
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>{formatSubmittedAt(item.submittedAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2 min-w-[140px]">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDetailDialog(item)}
                              className="gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              Xem
                            </Button>
                            {item.status === 'PendingReview' ? (
                              <VerifyUserDialog
                                request={item}
                                onCompleted={() => setRefreshToken(prev => prev + 1)}
                              />
                            ) : (
                              <div className="w-9 h-9" /> // Placeholder để giữ layout đều
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Footer */}
              <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {filteredVerifications.length} / {totalRecords} đơn xác minh
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <span className="px-4 text-sm">
                        Trang {page} / {totalPages}
                      </span>
                    </PaginationItem>
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="gap-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn xác minh</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn xác minh của người thu gom
            </DialogDescription>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Tên người dùng</div>
                  <div className="text-sm font-semibold">{selectedVerification.user.fullName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Số điện thoại</div>
                  <div className="text-sm font-semibold">{selectedVerification.user.phoneNumber}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Hạng</div>
                  <div className="text-sm font-semibold">{selectedVerification.user.rank}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Điểm</div>
                  <div className="text-sm font-semibold">{selectedVerification.user.pointBalance.toLocaleString('vi-VN')}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Role</div>
                  <div className="text-sm font-semibold">
                    {selectedVerification.user.roles?.join(', ') || 'Chưa gán'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Trạng thái</div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeStyles[selectedVerification.status]}`}
                  >
                    {statusIconMap[selectedVerification.status]}
                    {selectedVerification.status}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Ngày gửi</div>
                  <div className="text-sm font-semibold">{formatSubmittedAt(selectedVerification.submittedAt)}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Tài liệu đính kèm</div>
                <div className="flex gap-2">
                  {selectedVerification.documentFrontUrl ? (
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <a href={selectedVerification.documentFrontUrl} target="_blank" rel="noopener noreferrer">
                        Xem mặt trước
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Mặt trước: —</span>
                  )}
                  {selectedVerification.documentBackUrl ? (
                    <Button asChild variant="outline" size="sm" className="gap-1">
                      <a href={selectedVerification.documentBackUrl} target="_blank" rel="noopener noreferrer">
                        Xem mặt sau
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Mặt sau: —</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
