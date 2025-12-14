'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  getAdminVerifications,
  type AdminVerificationItem,
  type AdminVerificationStatus,
} from '@/lib/api/verifications'
import { AlertCircle, Search, ChevronLeft, ChevronRight, Clock8, CheckCircle2, XCircle, Eye } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
  { label: 'Đang chờ xem xét', value: 'PendingReview' },
  { label: 'Đã duyệt', value: 'Approved' },
  { label: 'Đã từ chối', value: 'Rejected' },
]

const formatVerificationStatus = (status: AdminVerificationStatus): string => {
  switch (status) {
    case 'PendingReview':
      return 'Đang chờ xem xét'
    case 'Approved':
      return 'Đã duyệt'
    case 'Rejected':
      return 'Đã từ chối'
    default:
      return status
  }
}

const getStatusBadgeVariant = (status: AdminVerificationStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Approved':
      return 'default'
    case 'Rejected':
      return 'destructive'
    case 'PendingReview':
    default:
      return 'outline'
  }
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
      const errorMessage = fetchError instanceof Error
        ? fetchError.message
        : 'Không thể tải danh sách đơn xác minh. Vui lòng thử lại.'
      setError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
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
        <h1 className="text-3xl font-bold">Người thu gom</h1>
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
            <div className="relative w-full sm:max-w-2xl lg:max-w-3xl">
              <Input
                placeholder="Tìm theo tên hoặc số điện thoại"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value)
                  setPage(1) // Reset về trang 1 khi search
                }}
                className="pl-9 pr-3"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={value => setStatusFilter(value as typeof statusFilter)}>
                <SelectTrigger className="w-48 select-text">
                  <SelectValue placeholder="Tất cả trạng thái" className="select-text" />
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
            <div className="space-y-4 p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên / Điện thoại</TableHead>
                    <TableHead>Hạng</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày gửi</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <>
              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên / Điện thoại</TableHead>
                    <TableHead>Hạng</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày gửi</TableHead>
                    <TableHead className="w-[180px] text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVerifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
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
                          <Badge variant={getStatusBadgeVariant(item.status)} className="gap-1">
                            {statusIconMap[item.status]}
                            {formatVerificationStatus(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatSubmittedAt(item.submittedAt)}</TableCell>
                        <TableCell className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenDetailDialog(item)}
                                  className="gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  Xem
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Xem chi tiết đơn xác minh</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Footer */}
              <div className="flex flex-col items-center gap-4 border-t pt-4 sm:flex-row sm:justify-end">
                <div className="text-sm text-muted-foreground sm:mr-auto">
                  Hiển thị {filteredVerifications.length} / {totalRecords} đơn xác minh
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        size="default"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page > 1) handlePageChange(page - 1)
                        }}
                        className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= page - 1 && pageNum <= page + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              href="#"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(pageNum)
                              }}
                              isActive={pageNum === page}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      } else if (pageNum === page - 2 || pageNum === page + 2) {
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      }
                      return null
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        size="default"
                        onClick={(e) => {
                          e.preventDefault()
                          if (page < totalPages) handlePageChange(page + 1)
                        }}
                        className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
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
                  <div className="text-sm font-semibold dialog-value">{selectedVerification.user.fullName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Số điện thoại</div>
                  <div className="text-sm font-semibold dialog-value">{selectedVerification.user.phoneNumber}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Hạng</div>
                  <div className="text-sm font-semibold dialog-value">{selectedVerification.user.rank}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Điểm</div>
                  <div className="text-sm font-semibold dialog-value">{selectedVerification.user.pointBalance.toLocaleString('vi-VN')}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Vai trò</div>
                  <div className="text-sm font-semibold dialog-value">
                    {selectedVerification.user.roles?.join(', ') || 'Chưa gán'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Trạng thái</div>
                  <Badge variant={getStatusBadgeVariant(selectedVerification.status)} className="gap-1">
                    {statusIconMap[selectedVerification.status]}
                    {formatVerificationStatus(selectedVerification.status)}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Ngày gửi</div>
                  <div className="text-sm font-semibold dialog-value">{formatSubmittedAt(selectedVerification.submittedAt)}</div>
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
