'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { users, type User } from '@/lib/api/user-api'
import { AlertCircle, Search, ChevronLeft, ChevronRight, Ban, Unlock, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useLoading } from '@/contexts/loading-context'
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
  { label: 'Đang hoạt động', value: 'Active' },
  { label: 'Đã chặn', value: 'Blocked' },
]

const formatUserStatus = (status: string): string => {
  switch (status) {
    case 'Active':
      return 'Đang hoạt động'
    case 'Blocked':
      return 'Đã chặn'
    default:
      return status
  }
}

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Active':
      return 'default'
    case 'Blocked':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export default function UsersPage() {
  const { startLoading, stopLoading } = useLoading()
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
    startLoading("Đang tải danh sách người dùng...")

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
      const errorMessage = fetchError instanceof Error
        ? fetchError.message
        : 'Không thể tải danh sách người dùng. Vui lòng thử lại.'
      setError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
      stopLoading()
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
      startLoading(selectedUser.status === 'Blocked' ? 'Đang mở khóa tài khoản...' : 'Đang cấm tài khoản...')
      await users.banToggle(selectedUser.id)
      await fetchUsers() // Refresh danh sách
      handleCloseBanDialog()
      toast.success('Thành công', {
        description: selectedUser.status === 'Blocked' 
          ? 'Đã mở khóa tài khoản thành công' 
          : 'Đã cấm tài khoản thành công',
      })
    } catch (banError) {
      const errorMessage = banError instanceof Error
        ? banError.message
        : 'Không thể thay đổi trạng thái tài khoản. Vui lòng thử lại.'
      setError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
    } finally {
      setIsBanning(false)
      stopLoading()
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
            <div className="relative w-full sm:max-w-2xl lg:max-w-3xl">
              <Input
                placeholder="Tìm theo tên hoặc số điện thoại"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value)
                  setPage(1) // Reset về trang 1 khi search
                }}
                className="pl-9 pr-3"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                defaultValue="all"
                onValueChange={value => setStatusFilter(value as typeof statusFilter)}
              >
                <SelectTrigger className="w-48 select-text">
                  <SelectValue
                    placeholder="Tất cả trạng thái"
                    className="select-text"
                  />
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
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên / Điện thoại</TableHead>
                    <TableHead>Hạng</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
                          <Badge variant={getStatusBadgeVariant(user.status)}>
                            {formatUserStatus(user.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenBanDialog(user)}
                                  className={user.status === 'Blocked' 
                                    ? "gap-1 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 border-black dark:border-white" 
                                    : "gap-1 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 border-black dark:border-white"}
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
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{user.status === 'Blocked' ? 'Mở khóa tài khoản' : 'Cấm tài khoản'}</p>
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
                  Hiển thị {filteredUsers.length} / {totalRecords} người dùng
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

      {/* Ban/Unban Dialog */}
      <Dialog open={banDialogOpen} onOpenChange={setBanDialogOpen}>
        <DialogContent className="bg-background dark:bg-background border-2 border-border dark:border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-foreground text-xl font-bold">
              {selectedUser?.status === 'Blocked' ? 'Mở khóa tài khoản' : 'Cấm tài khoản'}
            </DialogTitle>
            <DialogDescription className="text-foreground/80 dark:text-foreground/80 text-base leading-relaxed">
              {selectedUser?.status === 'Blocked' ? (
                <>
                  Bạn có chắc chắn muốn mở khóa tài khoản của <strong className="text-foreground dark:text-foreground font-semibold">{selectedUser?.fullName}</strong> không?
                  <br />
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Người dùng này sẽ có thể đăng nhập và sử dụng hệ thống trở lại.
                  </span>
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn cấm tài khoản của <strong className="text-foreground dark:text-foreground font-semibold">{selectedUser?.fullName}</strong> không?
                  <br />
                  <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                    Người dùng này sẽ không thể đăng nhập vào hệ thống.
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button 
              variant="outline" 
              onClick={handleCloseBanDialog} 
              disabled={isBanning}
              className="border-2 border-border dark:border-border text-foreground dark:text-foreground hover:bg-accent dark:hover:bg-accent"
            >
              Hủy
            </Button>
            <Button
              variant={selectedUser?.status === 'Blocked' ? 'default' : 'destructive'}
              onClick={handleBanToggle}
              disabled={isBanning}
              className={selectedUser?.status === 'Blocked' 
                ? "bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
                : "bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive dark:text-white"}
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

