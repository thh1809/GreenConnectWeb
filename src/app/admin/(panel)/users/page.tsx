'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
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
import { VerifyUserDialog } from '@/page/admin/components/verify-user-dialog'
import { getAdminVerifications, type AdminVerificationItem, type AdminVerificationStatus } from '@/lib/api/verifications'
import { ArrowDownToLine, AlertCircle, CheckCircle2, Clock8, Search, XCircle } from 'lucide-react'

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

export default function UsersPage() {
  const [verifications, setVerifications] = useState<AdminVerificationItem[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | AdminVerificationStatus>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
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
            : 'Không thể tải danh sách xác minh. Vui lòng thử lại.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchVerifications()
  }, [page, refreshToken])

  const filteredVerifications = useMemo(() => {
    if (statusFilter === 'all') {
      return verifications
    }
    return verifications.filter(item => item.status === statusFilter)
  }, [verifications, statusFilter])

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

  const handlePrev = (event: React.MouseEvent) => {
    event.preventDefault()
    if (prevPage) {
      setPage(prevPage)
    }
  }

  const handleNext = (event: React.MouseEvent) => {
    event.preventDefault()
    if (nextPage) {
      setPage(nextPage)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage user accounts, verification, and access control
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <input
                placeholder="Tìm theo tên hoặc số điện thoại"
                className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
                disabled
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
                <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVerifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                        Không có hồ sơ phù hợp bộ lọc hiện tại.
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
                          {item.status === "PendingReview" ? (
                            <VerifyUserDialog
                              request={item}
                              onCompleted={() => setRefreshToken(prev => prev + 1)}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Đã xử lý</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Footer */}
              <div className="flex flex-col items-center justify-between gap-3 pt-2 text-xs text-muted-foreground sm:flex-row">
                <div>
                  Hiển thị {filteredVerifications.length} / {totalRecords} hồ sơ
                </div>
                <Pagination className="justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={handlePrev}
                        className={!prevPage ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    <PaginationItem className="px-2 py-1 text-sm text-foreground">
                      Trang {page} / {totalPages}
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={handleNext}
                        className={!nextPage ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

