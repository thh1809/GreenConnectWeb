'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Search, Pencil, Trash2, Plus, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { prices as pricesApi, type ReferencePrice } from '@/lib/api/prices'
import { categories as categoriesApi, type ScrapCategory } from '@/lib/api/categories'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function PricesPage() {
  const [pricesData, setPricesData] = useState<ReferencePrice[]>([])
  const [categoriesData, setCategoriesData] = useState<ScrapCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortByUpdateAt, setSortByUpdateAt] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPrice, setEditingPrice] = useState<ReferencePrice | null>(null)
  const [categoryId, setCategoryId] = useState('')
  const [pricePerKg, setPricePerKg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailPrice, setDetailPrice] = useState<ReferencePrice | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [priceToDelete, setPriceToDelete] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll({ pageNumber: 1, pageSize: 100 })
      setCategoriesData(response.data)
    } catch (err) {
      setError('Không thể tải danh sách danh mục')
    }
  }

  const fetchPrices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await pricesApi.getAll({
        pageNumber: currentPage,
        pageSize,
        sortByUpdateAt,
      })
      setPricesData(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalRecords(response.pagination.totalRecords)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách giá')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchPrices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sortByUpdateAt])

  const handleOpenDialog = async (priceItem?: ReferencePrice) => {
    // Đảm bảo categories đã được load trước khi mở dialog
    if (categoriesData.length === 0) {
      await fetchCategories()
    }
    if (priceItem) {
      setEditingPrice(priceItem)
      setCategoryId(priceItem.scrapCategoryId.toString())
      setPricePerKg(priceItem.pricePerKg?.toString() || '')
    } else {
      setEditingPrice(null)
      setCategoryId('')
      setPricePerKg('')
    }
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingPrice(null)
    setCategoryId('')
    setPricePerKg('')
    setDialogError(null)
  }

  const handleSavePrice = async () => {
    if (!categoryId || !pricePerKg.trim()) {
      setDialogError('Vui lòng điền đầy đủ thông tin')
      return
    }

    const priceValue = parseFloat(pricePerKg)
    if (isNaN(priceValue) || priceValue < 0) {
      setDialogError('Giá phải là số hợp lệ và lớn hơn hoặc bằng 0')
      return
    }

    try {
      setIsSubmitting(true)
      setDialogError(null)

      if (editingPrice) {
        // Update existing price (PATCH)
        await pricesApi.update(editingPrice.referencePriceId, {
          pricePerKg: priceValue,
        })
      } else {
        // Create new price (POST)
        await pricesApi.create({
          scrapCategoryId: parseInt(categoryId),
          pricePerKg: priceValue,
        })
      }

      await fetchPrices()
      handleCloseDialog()
    } catch (err) {
      setDialogError(err instanceof Error ? err.message : 'Không thể lưu giá tham khảo')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setPriceToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!priceToDelete) return

    try {
      await pricesApi.delete(priceToDelete)
      await fetchPrices()
      setDeleteDialogOpen(false)
      setPriceToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa giá tham khảo')
      setDeleteDialogOpen(false)
      setPriceToDelete(null)
    }
  }

  const handleViewDetail = async (id: string) => {
    try {
      setDetailLoading(true)
      setDetailError(null)
      const price = await pricesApi.getById(id)
      setDetailPrice(price)
      setDetailDialogOpen(true)
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : 'Không thể tải chi tiết giá tham khảo')
    } finally {
      setDetailLoading(false)
    }
  }

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false)
    setDetailPrice(null)
    setDetailError(null)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const filteredPrices = pricesData.filter(priceItem => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      priceItem.scrapCategory?.categoryName?.toLowerCase().includes(query) ||
      priceItem.pricePerKg?.toString().includes(query) ||
      priceItem.referencePriceId.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold leading-tight">Giá tham khảo</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Quản lý giá tham khảo cho các loại ve chai và phế liệu
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={open => {
            if (open) {
              handleOpenDialog()
            } else {
              handleCloseDialog()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="primary" className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Thêm giá mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl bg-card">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-2xl font-bold">
                {editingPrice ? 'Chỉnh sửa giá tham khảo' : 'Thêm giá tham khảo mới'}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingPrice
                  ? 'Cập nhật thông tin giá tham khảo bên dưới.'
                  : 'Nhập thông tin để tạo giá tham khảo mới.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold">
                  Danh mục <span className="text-danger">*</span>
                </Label>
                <Select 
                  value={categoryId} 
                  onValueChange={setCategoryId}
                  disabled={categoriesData.length === 0}
                >
                  <SelectTrigger 
                    id="category" 
                    className="bg-background w-full"
                    aria-label="Chọn danh mục"
                  >
                    <SelectValue placeholder={categoriesData.length === 0 ? 'Đang tải danh mục...' : 'Chọn danh mục'} />
                  </SelectTrigger>
                  <SelectContent 
                    className="z-[100]"
                    position="popper"
                    sideOffset={4}
                  >
                    {categoriesData.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                        Đang tải danh mục...
                      </div>
                    ) : (
                      categoriesData.map(category => (
                        <SelectItem 
                          key={category.scrapCategoryId} 
                          value={category.scrapCategoryId.toString()}
                        >
                          {category.categoryName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerKg" className="text-sm font-semibold">
                  Giá mỗi kg (VNĐ) <span className="text-danger">*</span>
                </Label>
                <Input
                  id="pricePerKg"
                  type="number"
                  value={pricePerKg}
                  onChange={e => setPricePerKg(e.target.value)}
                  placeholder="Nhập giá mỗi kg"
                  min="0"
                  step="100"
                  className="bg-background"
                />
              </div>

              {/* Error Message */}
              {dialogError && (
                <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {dialogError}
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCloseDialog} disabled={isSubmitting}>
                  Hủy
                </Button>
              </DialogClose>
              <Button
                variant="primary"
                onClick={handleSavePrice}
                disabled={!categoryId || !pricePerKg.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Prices List Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Danh sách giá tham khảo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Input
                placeholder="Tìm kiếm theo danh mục, giá hoặc ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-background pl-9 pr-3"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Select
                value={sortByUpdateAt ? 'true' : 'false'}
                onValueChange={value => setSortByUpdateAt(value === 'true')}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sắp xếp theo ngày cập nhật</SelectItem>
                  <SelectItem value="false">Không sắp xếp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : filteredPrices.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {searchQuery ? 'Không tìm thấy giá tham khảo nào' : 'Chưa có giá tham khảo nào'}
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="h-12 px-4 font-semibold">ID</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Danh mục</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Giá mỗi kg (VNĐ)</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Cập nhật lần cuối</TableHead>
                      <TableHead className="h-12 px-4 text-right font-semibold">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrices.map(priceItem => (
                      <TableRow key={priceItem.referencePriceId} className="border-b">
                        <TableCell className="px-4 py-4 font-medium">
                          {priceItem.referencePriceId.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="px-4 py-4 font-medium">
                          {priceItem.scrapCategory?.categoryName || `Danh mục #${priceItem.scrapCategoryId}`}
                        </TableCell>
                        <TableCell className="px-4 py-4 font-semibold text-primary">
                          {priceItem.pricePerKg !== undefined && priceItem.pricePerKg !== null
                            ? `${priceItem.pricePerKg.toLocaleString('vi-VN')} đ/kg`
                            : '-'}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-muted-foreground">
                          {priceItem.lastUpdated
                            ? new Date(priceItem.lastUpdated).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="icon-sm"
                              variant="outline"
                              aria-label="View"
                              className="h-8 w-8"
                              onClick={() => handleViewDetail(priceItem.referencePriceId)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="outline"
                              aria-label="Edit"
                              className="h-8 w-8"
                              onClick={() => handleOpenDialog(priceItem)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="destructive"
                              aria-label="Delete"
                              className="h-8 w-8"
                              onClick={() => handleDeleteClick(priceItem.referencePriceId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Footer */}
              {!searchQuery && (
                <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {pricesData.length} / {totalRecords} giá tham khảo
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>Previous</span>
                        </Button>
                      </PaginationItem>
                      <PaginationItem>
                        <span className="px-4 text-sm">
                          Trang {currentPage} / {totalPages}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="gap-1"
                        >
                          <span>Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl bg-card">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-bold">Chi tiết giá tham khảo</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Thông tin chi tiết về giá tham khảo
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : detailError ? (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {detailError}
            </div>
          ) : detailPrice ? (
            <div className="space-y-6">
              {/* Price Details */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground">ID</Label>
                  <div className="text-base font-medium font-mono">{detailPrice.referencePriceId}</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground">Danh mục</Label>
                  <div className="text-base font-semibold">
                    {detailPrice.scrapCategory?.categoryName || `Danh mục #${detailPrice.scrapCategoryId}`}
                  </div>
                  {detailPrice.scrapCategory?.description && (
                    <div className="text-sm text-muted-foreground">
                      {detailPrice.scrapCategory.description}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground">Giá mỗi kg (VNĐ)</Label>
                  <div className="text-2xl font-bold text-primary">
                    {detailPrice.pricePerKg !== undefined && detailPrice.pricePerKg !== null
                      ? `${detailPrice.pricePerKg.toLocaleString('vi-VN')} đ/kg`
                      : '-'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground">Cập nhật lần cuối</Label>
                  <div className="text-base">
                    {detailPrice.lastUpdated
                      ? new Date(detailPrice.lastUpdated).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : '-'}
                  </div>
                </div>

                {detailPrice.updatedByAdmin && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Cập nhật bởi</Label>
                    <div className="space-y-1">
                      <div className="text-base font-medium">{detailPrice.updatedByAdmin.fullName}</div>
                      {detailPrice.updatedByAdmin.phoneNumber && (
                        <div className="text-sm text-muted-foreground">
                          {detailPrice.updatedByAdmin.phoneNumber}
                        </div>
                      )}
                      {detailPrice.updatedByAdmin.rank && (
                        <div className="text-sm text-muted-foreground">
                          Hạng: {detailPrice.updatedByAdmin.rank}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {detailPrice.updatedByAdminId && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">ID Người cập nhật</Label>
                    <div className="text-sm font-mono text-muted-foreground">
                      {detailPrice.updatedByAdminId}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={handleCloseDetailDialog}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            setPriceToDelete(null)
          }
        }}
      >
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa giá tham khảo này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
