'use client'

import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Search, MoreVertical, Trash2, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import Image from 'next/image'
import { posts as postsApi, type ScrapPost, type ScrapPostFull } from '@/lib/api/posts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type PostStatus = 'Open' | 'PartiallyBooked' | 'FullyBooked' | 'Completed' | 'Canceled'

const statusOptions: { label: string; value: PostStatus | 'all' }[] = [
  { label: 'Tất cả trạng thái', value: 'all' },
  { label: 'Mở', value: 'Open' },
  { label: 'Đã đặt một phần', value: 'PartiallyBooked' },
  { label: 'Đã đặt đầy', value: 'FullyBooked' },
  { label: 'Hoàn thành', value: 'Completed' },
  { label: 'Đã hủy', value: 'Canceled' },
]

const formatPostStatus = (status: PostStatus): string => {
  switch (status) {
    case 'Open':
      return 'Mở'
    case 'PartiallyBooked':
      return 'Đã đặt một phần'
    case 'FullyBooked':
      return 'Đã đặt đầy'
    case 'Completed':
      return 'Hoàn thành'
    case 'Canceled':
      return 'Đã hủy'
    default:
      return status
  }
}

const getStatusBadgeVariant = (status: PostStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Open':
      return 'default'
    case 'Completed':
      return 'secondary'
    case 'Canceled':
      return 'destructive'
    default:
      return 'outline'
  }
}

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

const formatRank = (rank: unknown) => {
  const raw =
    typeof rank === 'string'
      ? rank
      : rank && typeof rank === 'object'
        ? String((rank as any).name ?? (rank as any).rank ?? '')
        : ''

  const normalized = raw.trim()
  if (!normalized) return '—'

  const r = normalized.toLowerCase()
  if (r.includes('bronze')) return 'Đồng (Bronze)'
  if (r.includes('silver')) return 'Bạc (Silver)'
  if (r.includes('gold')) return 'Vàng (Gold)'
  if (r.includes('platinum')) return 'Bạch kim (Platinum)'
  if (r.includes('diamond')) return 'Kim cương (Diamond)'

  if (normalized.includes('.')) {
    const last = normalized.split('.').pop()
    const cleaned = last || normalized
    if (cleaned.toLowerCase() === 'rank') return '—'
    return cleaned
  }

  if (r === 'rank') return '—'

  return normalized
}

const PAGE_SIZE = 10

export default function PostsPage() {
  const [postsData, setPostsData] = useState<ScrapPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)
  
  // Filters
  const [categoryName, setCategoryName] = useState('')
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [sortByLocation, setSortByLocation] = useState(false)
  const [sortByCreateAt, setSortByCreateAt] = useState(false)
  
  // Detail dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [postDetail, setPostDetail] = useState<ScrapPostFull | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await postsApi.getAll({
        categoryName: categoryName.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortByLocation: sortByLocation || undefined,
        sortByCreateAt: sortByCreateAt || undefined,
        pageNumber: page,
        pageSize: PAGE_SIZE,
      })
      
      setPostsData(response.data)
      setTotalRecords(response.pagination.totalRecords)
      setTotalPages(response.pagination.totalPages)
      setNextPage(response.pagination.nextPage)
      setPrevPage(response.pagination.prevPage)
    } catch (fetchError) {
      const errorMessage = fetchError instanceof Error
        ? fetchError.message
        : 'Không thể tải danh sách bài đăng. Vui lòng thử lại.'
      setError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categoryName, statusFilter, sortByLocation, sortByCreateAt])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const handleOpenDetailDialog = async (postId: string) => {
    setSelectedPostId(postId)
    setDetailDialogOpen(true)
    setIsLoadingDetail(true)
    
    try {
      const detail = await postsApi.getById(postId)
      setPostDetail(detail)
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Không thể tải chi tiết bài đăng'
      toast.error('Lỗi', {
        description: errorMessage,
      })
      setDetailDialogOpen(false)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false)
    setSelectedPostId(null)
    setPostDetail(null)
    setDeletingCategoryId(null)
    setDeleteConfirmOpen(false)
    setCategoryToDelete(null)
  }

  const handleDeleteClick = (categoryId: string) => {
    if (!postDetail) {
      toast.error('Lỗi', {
        description: 'Không thể xóa món hàng khi chưa tải chi tiết bài đăng',
      })
      return
    }

    setCategoryToDelete(categoryId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedPostId || categoryToDelete === null) return

    try {
      setDeletingCategoryId(categoryToDelete)
      await postsApi.deleteDetail(selectedPostId, categoryToDelete)
      
      // Refresh post detail
      const updatedDetail = await postsApi.getById(selectedPostId)
      setPostDetail(updatedDetail)
      
      toast.success('Thành công', {
        description: 'Đã xóa món hàng khỏi bài đăng',
      })
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Không thể xóa món hàng. Vui lòng thử lại.'
      toast.error('Lỗi', {
        description: errorMessage,
      })
    } finally {
      setDeletingCategoryId(null)
      setDeleteConfirmOpen(false)
      setCategoryToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bài đăng</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý và kiểm duyệt bài đăng thu gom từ người dùng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài đăng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-2xl lg:max-w-3xl">
              <Input
                placeholder="Tìm kiếm theo tên danh mục..."
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value)
                  setPage(1) // Reset về trang 1 khi search
                }}
                className="pl-9 pr-3"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select 
                value={statusFilter} 
                onValueChange={(value) => {
                  setStatusFilter(value as PostStatus | 'all')
                  setPage(1)
                }}
              >
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
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead>Thời gian có sẵn</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-12 w-12 rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : error ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              {error}
            </div>
          ) : (
            <>
          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Tác giả</TableHead>
                    <TableHead>Thời gian có sẵn</TableHead>
                <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {postsData.length === 0 ? (
                    <TableRow key="empty">
                      <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                        Không có bài đăng nào phù hợp bộ lọc hiện tại.
                  </TableCell>
                    </TableRow>
                  ) : (
                    postsData.map(post => (
                      <TableRow key={post.scrapPostId}>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md border border-border">
                            {post.household.avatarUrl ? (
                      <Image
                                src={post.household.avatarUrl}
                                alt={post.household.fullName || 'Avatar'}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                            ) : (
                              <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                {post.household.fullName.charAt(0).toUpperCase()}
                              </div>
                            )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{post.household.fullName}</span>
                            <span className="text-xs text-muted-foreground">{post.household.phoneNumber}</span>
                          </div>
                  </TableCell>
                        <TableCell className="text-sm">{post.availableTimeRange || '—'}</TableCell>
                  <TableCell>
                          <Badge variant={getStatusBadgeVariant(post.status)}>
                            {formatPostStatus(post.status)}
                          </Badge>
                  </TableCell>
                        <TableCell className="text-sm">{formatDate(post.createdAt)}</TableCell>
                  <TableCell className="space-x-2 text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                    <Button
                                  size="icon"
                      variant="outline"
                                  onClick={() => handleOpenDetailDialog(post.scrapPostId)}
                                  aria-label="Xem chi tiết"
                    >
                                  <Eye className="h-4 w-4" />
                    </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Xem chi tiết bài đăng</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                    <Button
                            size="icon"
                      variant="destructive"
                      aria-label="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                    ))
                  )}
            </TableBody>
          </Table>

          {/* Footer */}
              <div className="flex flex-col items-center gap-4 border-t pt-4 sm:flex-row sm:justify-end">
                <div className="text-sm text-muted-foreground sm:mr-auto">
                  Hiển thị {postsData.length} / {totalRecords} bài đăng
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background dark:bg-background border-2 border-border dark:border-border">
          <DialogHeader>
            <DialogTitle>Chi tiết bài đăng</DialogTitle>
            <DialogDescription>
              Thông tin đầy đủ về bài đăng thu gom
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingDetail ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : postDetail ? (
            <div className="space-y-6">
              {/* Household Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Người đăng</div>
                  <div className="text-sm font-semibold dialog-value">{postDetail.household.fullName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Số điện thoại</div>
                  <div className="text-sm font-semibold dialog-value">{postDetail.household.phoneNumber}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Hạng</div>
                  <div className="text-sm font-semibold dialog-value">{formatRank(postDetail.household.rank)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Điểm</div>
                  <div className="text-sm font-semibold dialog-value">{(postDetail.household.pointBalance ?? 0).toLocaleString('vi-VN')}</div>
                </div>
              </div>

              {/* Post Info */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Tiêu đề</div>
                  <div className="text-base font-semibold dialog-value">{postDetail.title}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Mô tả</div>
                  <div className="text-sm dialog-value whitespace-pre-wrap">{postDetail.description}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Địa chỉ</div>
                  <div className="text-sm dialog-value">{postDetail.address}</div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Thời gian có sẵn</div>
                    <div className="text-sm dialog-value">{postDetail.availableTimeRange || '—'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Trạng thái</div>
                    <Badge variant={getStatusBadgeVariant(postDetail.status)}>
                      {formatPostStatus(postDetail.status)}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Ngày tạo</div>
                    <div className="text-sm dialog-value">{formatDate(postDetail.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Bắt buộc mua trọn gói</div>
                    <div className="text-sm dialog-value">
                      {postDetail.mustTakeAll ? (
                        <Badge variant="default">Có</Badge>
                      ) : (
                        <Badge variant="outline">Không</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrap Details */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-muted-foreground">Chi tiết ve chai</div>
                {postDetail.scrapPostDetails.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Không có chi tiết</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {postDetail.scrapPostDetails.map((detail, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2 relative">
                        {detail.status === 'Available' && (
                          <div className="absolute top-2 right-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => handleDeleteClick(detail.scrapCategoryId)}
                                    disabled={deletingCategoryId === detail.scrapCategoryId}
                                    className="h-7 w-7"
                                    aria-label="Xóa món hàng"
                                  >
                                    {deletingCategoryId === detail.scrapCategoryId ? (
                                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                      <Trash2 className="h-3 w-3" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Xóa món hàng khỏi bài đăng</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Danh mục</div>
                          <div className="text-sm font-semibold dialog-value">{detail.scrapCategory.categoryName}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Khối lượng</div>
                          <div className="text-sm dialog-value">{detail.amountDescription || '—'}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">Trạng thái</div>
                          <Badge variant={detail.status === 'Available' ? 'default' : 'secondary'}>
                            {detail.status === 'Available' ? 'Có sẵn' : detail.status === 'Booked' ? 'Đã đặt' : 'Hoàn thành'}
                          </Badge>
                        </div>
                        {detail.imageUrl && (
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Hình ảnh</div>
                            <div className="h-32 w-full overflow-hidden rounded-md border border-border">
                              <Image
                                src={detail.imageUrl}
                                alt={detail.scrapCategory?.categoryName || 'Ảnh món hàng'}
                                width={200}
                                height={128}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa món hàng "
              {postDetail && categoryToDelete
                ? postDetail.scrapPostDetails.find(d => d.scrapCategoryId === categoryToDelete)?.scrapCategory.categoryName || 'này'
                : 'này'}
              " khỏi bài đăng? Hành động này không thể hoàn tác.
              {postDetail?.mustTakeAll && (
                <span className="block mt-2 text-warning-update font-medium">
                  Lưu ý: Bài đăng này có trạng thái "Bắt buộc mua trọn gói", việc xóa có thể bị hạn chế.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-danger text-white hover:bg-danger/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
