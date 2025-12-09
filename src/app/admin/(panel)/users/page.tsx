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
import { users, type User } from '@/lib/api/user-api'
import { AlertCircle, Search, ChevronLeft, ChevronRight, Ban, Unlock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const PAGE_SIZE = 10
const statusOptions: { label: string; value: 'all' | string }[] = [
  { label: 'Tất cả trạng thái', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Blocked', value: 'Blocked' },
]

const statusBadgeStyles: Record<string, string> = {
  Active: 'bg-primary text-primary-foreground',
  Blocked: 'bg-danger text-white',
}

export default function UsersPage() {
  const [userList, setUserList] = useState<User[]>([])
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)
  const [banDialogOpen, setBanDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isBanning, setIsBanning] = useState(false)


  const filteredUsers = useMemo(() => {
    let filtered = userList
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter)
    }
    return filtered
  }, [userList, statusFilter])

  const formatDate = (dateString: string) => {
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

  const fetchUsers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await users.getAll({
        pageIndex: page,
        pageSize: PAGE_SIZE,
        fullName: searchQuery || undefined,
      })
      setUserList(response.data)
      setTotalRecords(response.pagination.totalRecords)
      setTotalPages(response.pagination.totalPages)
      setNextPage(response.pagination.nextPage)
      setPrevPage(response.pagination.prevPage)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Không thể tải danh sách người dùng. Vui lòng thử lại.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery])

  const handleOpenBanDialog = (user: User) => {
    setSelectedUser(user)
    setBanDialogOpen(true)
  }

  const handleCloseBanDialog = () => {
    setBanDialogOpen(false)
    setSelectedUser(null)
  }

  const handleBanToggle = async () => {
    if (!selectedUser) return

    try {
      setIsBanning(true)
      await users.banToggle(selectedUser.id)
      await fetchUsers() // Refresh danh sách
      handleCloseBanDialog()
    } catch (banError) {
      setError(
        banError instanceof Error
          ? banError.message
          : 'Không thể thay đổi trạng thái tài khoản. Vui lòng thử lại.',
      )
    } finally {
      setIsBanning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Người dùng </h1>
        <p className="text-sm text-muted-foreground">
          Xem danh sách người dùng của hệ thống 
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
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
                    <TableHead>Điểm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                        Không có người dùng phù hợp bộ lọc hiện tại.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{user.fullName}</span>
                            <span className="text-xs text-muted-foreground">{user.phoneNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.rank}</TableCell>
                        <TableCell>
                          {user.roles?.length ? (
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map(role => (
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
                        <TableCell>{user.pointBalance.toLocaleString('vi-VN')}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              statusBadgeStyles[user.status] || 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={user.status === 'Blocked' ? 'outline' : 'destructive'}
                            size="sm"
                            onClick={() => handleOpenBanDialog(user)}
                            className="gap-1"
                          >
                            {user.status === 'Blocked' ? (
                              <>
                                <Unlock className="h-4 w-4" />
                                Mở khóa
                              </>
                            ) : (
                              <>
                                <Ban className="h-4 w-4" />
                                Cấm
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Footer */}
              <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                <div className="text-sm text-muted-foreground">
                  Hiển thị {filteredUsers.length} / {totalRecords} người dùng
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

      {/* Ban/Unban Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.status === 'Blocked' ? 'Mở khóa tài khoản' : 'Cấm tài khoản'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.status === 'Blocked' ? (
                <>
                  Bạn có chắc chắn muốn mở khóa tài khoản của <strong>{selectedUser?.fullName}</strong> không?
                  Người dùng này sẽ có thể đăng nhập và sử dụng hệ thống trở lại.
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn cấm tài khoản của <strong>{selectedUser?.fullName}</strong> không?
                  Người dùng này sẽ không thể đăng nhập vào hệ thống.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseBanDialog} disabled={isBanning}>
              Hủy
            </Button>
            <Button
              variant={selectedUser?.status === 'Blocked' ? 'primary' : 'destructive'}
              onClick={handleBanToggle}
              disabled={isBanning}
            >
              {isBanning ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Đang xử lý...
                </>
              ) : selectedUser?.status === 'Blocked' ? (
                'Mở khóa'
              ) : (
                'Cấm tài khoản'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

