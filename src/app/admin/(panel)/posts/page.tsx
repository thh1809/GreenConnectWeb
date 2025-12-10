'use client'

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
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfirmRemoveDialog } from '@/page/admin/components/confirm-remove-dialog'
import { Flag, MoreVertical, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type PostStatus = 'Pending' | 'Approved' | 'Flagged'

const formatPostStatus = (status: PostStatus): string => {
  switch (status) {
    case 'Pending':
      return 'Đang chờ'
    case 'Approved':
      return 'Đã duyệt'
    case 'Flagged':
      return 'Đã gắn cờ'
    default:
      return status
  }
}

type Post = {
  id: string
  image: string
  title: string
  author: string
  location: string
  status: PostStatus
  reports: number
  date: string
}

const posts: Post[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `${i + 1}`,
  image: '/hero-image.png',
  title: `Eco-Friendly Initiative ${i + 1}`,
  author: `User ${i + 1}`,
  location:
    i % 3 === 0 ? 'Ho Chi Minh City' : i % 3 === 1 ? 'Hanoi' : 'Da Nang',
  status: i % 4 === 0 ? 'Flagged' : i % 4 === 1 ? 'Pending' : 'Approved',
  reports: i % 3 === 0 ? 5 : i % 3 === 1 ? 2 : 0,
  date: `15-${String(i + 1).padStart(2, '0')}-2026`,
}))

export default function PostsPage() {
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false)
  const [removeType, setRemoveType] = useState<'selected' | 'flagged'>(
    'selected'
  )

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedPosts(new Set(posts.map(p => p.id)))
    } else {
      setSelectedPosts(new Set())
    }
  }

  const handleSelectPost = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedPosts)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedPosts(newSelected)
    setSelectAll(newSelected.size === posts.length)
  }

  const flaggedCount = posts.filter(p => p.status === 'Flagged').length
  const selectedCount = selectedPosts.size

  const getStatusColor = (status: PostStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-primary text-primary-foreground'
      case 'Pending':
        return 'bg-warning/20 text-warning-update'
      case 'Flagged':
        return 'bg-danger text-white'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const handleRemoveSelected = () => {
    setRemoveType('selected')
    setRemoveDialogOpen(true)
  }

  const handleRemoveFlagged = () => {
    setRemoveType('flagged')
    setRemoveDialogOpen(true)
  }

  const handleConfirmRemove = (reason: string) => {
    if (removeType === 'selected') {
      setSelectedPosts(new Set())
      setSelectAll(false)
    } else {
      posts.filter(p => p.status === 'Flagged').map(p => p.id)
    }
    // TODO: call API
  }

  const getRemoveCount = () => {
    if (removeType === 'selected') {
      return selectedPosts.size
    } else {
      return flaggedCount
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bài đăng</h1>
        <p className="text-sm text-muted-foreground">
          Quản lý và kiểm duyệt bài đăng, đánh giá và nội dung từ người dùng
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quản lý bài đăng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-2xl lg:max-w-3xl">
              <Input
                placeholder="Tìm kiếm theo từ khóa hoặc tác giả..."
                className="pl-9 pr-3"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tất cả địa điểm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả địa điểm</SelectItem>
                  <SelectItem value="hcm">Ho Chi Minh City</SelectItem>
                  <SelectItem value="hanoi">Hanoi</SelectItem>
                  <SelectItem value="danang">Da Nang</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          {(selectedCount > 0 || flaggedCount > 0) && (
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/50 p-3">
              <span className="text-sm font-medium">Hành động hàng loạt:</span>
              {selectedCount > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveSelected}
                >
                  Xóa đã chọn ({selectedCount})
                </Button>
              )}
              {flaggedCount > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveFlagged}
                >
                  Xóa tất cả đã gắn cờ ({flaggedCount})
                </Button>
              )}
            </div>
          )}

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-input"
                  />
                </TableHead>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Báo cáo</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedPosts.has(post.id)}
                      onChange={e =>
                        handleSelectPost(post.id, e.target.checked)
                      }
                      className="h-4 w-4 cursor-pointer rounded border-input"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="h-12 w-12 overflow-hidden rounded-md border border-border">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.location}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                        post.status
                      )}`}
                    >
                      {formatPostStatus(post.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {post.reports > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
                        <Flag className="h-3 w-3" />
                        {post.reports}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{post.date}</TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      aria-label="Thêm tùy chọn"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="destructive"
                      aria-label="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Footer */}
          <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
            <div className="text-xs text-muted-foreground">
              Hiển thị 10 / 100 bài đăng
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    disabled
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Trước</span>
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4 text-sm">
                    Trang 1 / 1
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    disabled
                  >
                    <span>Sau</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Confirm Remove Dialog */}
      <ConfirmRemoveDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
        count={getRemoveCount()}
        itemType="posts"
        onConfirm={handleConfirmRemove}
      />
    </div>
  )
}

