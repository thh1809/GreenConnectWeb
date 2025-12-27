'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Search, Pencil, Plus, ChevronLeft, ChevronRight, Eye, PowerOff } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { packages as packagesApi, type PaymentPackage, type PaymentPackageListItem, type CreatePackageRequest, type UpdatePackageRequest } from '@/lib/api/packages'

export default function PaymentPage() {
  const [packagesData, setPackagesData] = useState<PaymentPackageListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [packageTypeFilter, setPackageTypeFilter] = useState<'all' | 'Freemium' | 'Paid'>('all')
  const [sortByPrice, setSortByPrice] = useState<boolean | undefined>(undefined)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PaymentPackageListItem | null>(null)
  const [packageName, setPackageName] = useState('')
  const [price, setPrice] = useState('')
  const [connectionAmount, setConnectionAmount] = useState('')
  const [description, setDescription] = useState('')
  const [packageType, setPackageType] = useState<'Freemium' | 'Paid'>('Paid')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  useEffect(() => {
    const priceValue = parseFloat(price)
    if (isNaN(priceValue)) return

    if (priceValue === 0) {
      if (packageType !== 'Freemium') setPackageType('Freemium')
      return
    }

    if (priceValue > 0) {
      if (packageType !== 'Paid') setPackageType('Paid')
    }
  }, [price, packageType])

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailPackage, setDetailPackage] = useState<PaymentPackage | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  // Inactivate confirmation dialog state
  const [inactivateDialogOpen, setInactivateDialogOpen] = useState(false)
  const [packageToInactivate, setPackageToInactivate] = useState<string | null>(null)
  const [isInactivating, setIsInactivating] = useState(false)

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params: {
        pageNumber: number
        pageSize: number
        sortByPrice?: boolean
        packageType?: 'Freemium' | 'Paid'
        name?: string
      } = {
        pageNumber: currentPage,
        pageSize,
      }

      if (sortByPrice !== undefined) {
        params.sortByPrice = sortByPrice
      }
      if (packageTypeFilter !== 'all') {
        params.packageType = packageTypeFilter
      }
      if (searchQuery.trim()) {
        params.name = searchQuery.trim()
      }

      const response = await packagesApi.getAll(params)
      
      setPackagesData(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalRecords(response.pagination.totalRecords)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách gói thanh toán'
      setError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, sortByPrice, packageTypeFilter, searchQuery])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  const handleOpenDialog = async (pkg?: PaymentPackageListItem) => {
    if (pkg) {
      try {
        setIsSubmitting(true)
        // Fetch full package details to get connectionAmount and isActive
        const fullPackage = await packagesApi.getById(pkg.packageId)
        setEditingPackage(pkg)
        setPackageName(fullPackage.name)
        setPrice(fullPackage.price.toString())
        setConnectionAmount(fullPackage.connectionAmount.toString())
        setDescription(fullPackage.description || '')
        setPackageType(fullPackage.packageType)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin gói'
        toast.error('Lỗi', {
          description: errorMessage,
        })
        return
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setEditingPackage(null)
      setPackageName('')
      setPrice('')
      setConnectionAmount('')
      setDescription('')
      setPackageType('Paid')
    }
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingPackage(null)
    setPackageName('')
    setPrice('')
    setConnectionAmount('')
    setDescription('')
    setPackageType('Paid')
    setDialogError(null)
  }

  const handleSavePackage = async () => {
    if (!packageName.trim() || !price.trim() || !connectionAmount.trim()) {
      setDialogError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    try {
      setIsSubmitting(true)
      setDialogError(null)

      const priceValue = parseFloat(price)
      const connectionAmountValue = parseInt(connectionAmount, 10)

      if (isNaN(priceValue) || priceValue < 0) {
        setDialogError('Giá phải là số không âm')
        return
      }

      if (priceValue === 0 && packageType !== 'Freemium') {
        setDialogError('Giá = 0 thì loại gói phải là Miễn phí')
        return
      }

      if (priceValue > 0 && packageType === 'Freemium') {
        setDialogError('Giá > 0 thì không được chọn Miễn phí')
        return
      }

      if (isNaN(connectionAmountValue) || connectionAmountValue <= 0) {
        setDialogError('Số lượt kết nối phải là số nguyên dương')
        return
      }

      const detectedPackageType: 'Freemium' | 'Paid' = priceValue === 0 ? 'Freemium' : packageType
      const packageData = {
        name: packageName.trim(),
        description: description.trim() || '',
        price: priceValue,
        connectionAmount: connectionAmountValue,
        packageType: detectedPackageType === 'Paid' ? 1 : 0, // 1 for Paid, 0 for Freemium
      }

      if (editingPackage) {
        // Update existing package
        await packagesApi.update(editingPackage.packageId, packageData as UpdatePackageRequest)
      } else {
        // Create new package
        await packagesApi.create(packageData as CreatePackageRequest)
      }

      handleCloseDialog()
      // Refresh data after save
      await fetchPackages()
      toast.success('Thành công', {
        description: editingPackage ? 'Đã cập nhật gói thanh toán thành công' : 'Đã tạo gói thanh toán thành công',
      })
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : editingPackage
          ? 'Không thể cập nhật gói thanh toán'
          : 'Không thể tạo gói thanh toán'
      setDialogError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewDetail = async (pkg: PaymentPackageListItem) => {
    setDetailDialogOpen(true)
    setDetailLoading(true)
    setDetailError(null)
    setDetailPackage(null)

    try {
      const packageDetail = await packagesApi.getById(pkg.packageId)
      setDetailPackage(packageDetail)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin chi tiết gói thanh toán'
      
      // Check if it's a 401 error
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        setDetailError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
        // API client will handle redirect automatically
      } else {
        setDetailError(errorMessage)
      }
      
      toast.error('Lỗi', {
        description: errorMessage.includes('401') || errorMessage.includes('Unauthorized')
          ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
          : errorMessage,
      })
    } finally {
      setDetailLoading(false)
    }
  }

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false)
    setDetailPackage(null)
    setDetailError(null)
  }

  const handleInactivateClick = (packageId: string) => {
    setPackageToInactivate(packageId)
    setInactivateDialogOpen(true)
  }

  const handleInactivateConfirm = async () => {
    if (!packageToInactivate) return

    try {
      setIsInactivating(true)
      await packagesApi.inactivate(packageToInactivate)
      setInactivateDialogOpen(false)
      
      // Refresh detail dialog if it's open for the same package
      if (detailDialogOpen && detailPackage?.packageId === packageToInactivate) {
        const updatedDetail = await packagesApi.getById(packageToInactivate)
        setDetailPackage(updatedDetail)
      }
      
      setPackageToInactivate(null)
      // Refresh data after inactivate
      await fetchPackages()
      toast.success('Thành công', {
        description: 'Đã ngưng hoạt động gói thanh toán thành công',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể ngưng hoạt động gói thanh toán'
      setError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
    } finally {
      setIsInactivating(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchPackages()
      } else {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // Reset to page 1 when filter changes
  useEffect(() => {
    if (currentPage === 1) {
      fetchPackages()
    } else {
      setCurrentPage(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageTypeFilter, sortByPrice])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold leading-tight">Gói thanh toán</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Quản lý các gói nạp tiền và thanh toán
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
            <Button variant="default" className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Thêm gói mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl bg-background dark:bg-background border-2 border-border dark:border-border">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-2xl font-bold">
                {editingPackage ? 'Chỉnh sửa gói thanh toán' : 'Thêm gói thanh toán mới'}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingPackage
                  ? 'Cập nhật thông tin gói thanh toán bên dưới.'
                  : 'Nhập thông tin để tạo gói thanh toán mới.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="packageName" className="text-sm font-semibold">
                  Tên gói <span className="text-danger">*</span>
                </Label>
                <Input
                  id="packageName"
                  value={packageName}
                  onChange={e => setPackageName(e.target.value)}
                  placeholder="Nhập tên gói"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold">
                  Giá (VNĐ) <span className="text-danger">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="Nhập giá"
                  min="0"
                  step="1000"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="connectionAmount" className="text-sm font-semibold">
                  Số coin quy đổi <span className="text-danger">*</span>
                </Label>
                <Input
                  id="connectionAmount"
                  type="number"
                  value={connectionAmount}
                  onChange={e => setConnectionAmount(e.target.value)}
                  placeholder="Nhập số coin quy đổi"
                  min="0"
                  step="1"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="packageType" className="text-sm font-semibold">
                  Loại gói <span className="text-danger">*</span>
                </Label>
                <Select value={packageType} onValueChange={value => setPackageType(value as 'Freemium' | 'Paid')}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại gói" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001]" position="popper" sideOffset={4}>
                    <SelectItem value="Freemium" disabled={(() => {
                      const pv = parseFloat(price)
                      return !isNaN(pv) && pv > 0
                    })()}>
                      Miễn phí
                    </SelectItem>
                    <SelectItem value="Paid" disabled={(() => {
                      const pv = parseFloat(price)
                      return !isNaN(pv) && pv === 0
                    })()}>
                      Trả phí
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Nhập mô tả gói thanh toán"
                  rows={4}
                  className="bg-background resize-none"
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
                variant="default"
                onClick={handleSavePackage}
                disabled={!packageName.trim() || !price.trim() || !connectionAmount.trim() || isSubmitting}
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

      {/* Packages List Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Danh sách gói thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-2xl lg:max-w-3xl">
              <Input
                placeholder="Tìm kiếm theo tên, số tiền hoặc ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-3"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Select
                value={packageTypeFilter}
                onValueChange={value => setPackageTypeFilter(value as typeof packageTypeFilter)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo loại gói" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Freemium">Miễn phí</SelectItem>
                  <SelectItem value="Paid">Trả phí</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortByPrice === undefined ? 'none' : sortByPrice ? 'asc' : 'desc'}
                onValueChange={value => {
                  if (value === 'none') {
                    setSortByPrice(undefined)
                  } else {
                    setSortByPrice(value === 'asc')
                  }
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sắp xếp theo giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không sắp xếp</SelectItem>
                  <SelectItem value="desc">Giá giảm dần</SelectItem>
                  <SelectItem value="asc">Giá tăng dần</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="space-y-4 p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tên gói</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Loại gói</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : packagesData.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {searchQuery || packageTypeFilter !== 'all'
                ? 'Không tìm thấy gói thanh toán nào'
                : 'Chưa có gói thanh toán nào'}
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="h-12 px-4 font-semibold">ID</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Tên gói</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Giá</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Loại gói</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Mô tả</TableHead>
                      <TableHead className="h-12 px-4 text-right font-semibold">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packagesData.map(pkg => (
                      <TableRow key={pkg.packageId} className="border-b">
                        <TableCell className="px-4 py-4 font-medium">
                          #{pkg.packageId.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="px-4 py-4 font-medium">{pkg.name}</TableCell>
                        <TableCell className="px-4 py-4 font-semibold text-primary">
                          {pkg.price.toLocaleString('vi-VN')} đ
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                              pkg.packageType === 'Paid'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {pkg.packageType === 'Paid' ? 'Trả phí' : 'Miễn phí'}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-muted-foreground">
                          {pkg.description || '-'}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="outline"
                                    aria-label="View"
                                    className="h-8 w-8"
                                    onClick={() => handleViewDetail(pkg)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Xem chi tiết</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="outline"
                                    aria-label="Edit"
                                    className="h-8 w-8"
                                    onClick={() => handleOpenDialog(pkg)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Chỉnh sửa gói</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Footer */}
              <div className="flex flex-col items-center gap-4 border-t pt-4 sm:flex-row sm:justify-end">
                <div className="text-sm text-muted-foreground sm:mr-auto">
                  Hiển thị {packagesData.length} / {totalRecords} gói thanh toán
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        size="default"
                        onClick={(e) => {
                          e.preventDefault()
                          if (currentPage > 1) handlePageChange(currentPage - 1)
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
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
                              isActive={pageNum === currentPage}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
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
                          if (currentPage < totalPages) handlePageChange(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl bg-background dark:bg-background border-2 border-border dark:border-border">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-bold">Chi tiết gói thanh toán</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Thông tin chi tiết về gói thanh toán
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
          ) : detailPackage ? (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground dark:text-white/80">ID</Label>
                  <div className="text-base font-medium font-mono">#{detailPackage.packageId}</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground">Tên gói</Label>
                  <div className="text-base font-semibold">{detailPackage.name}</div>
                </div>

                {detailPackage.description && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Mô tả</Label>
                    <div className="text-base text-muted-foreground whitespace-pre-wrap">
                      {detailPackage.description}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Giá</Label>
                    <div className="text-xl font-bold text-primary">
                      {detailPackage.price.toLocaleString('vi-VN')} đ
                    </div>
                  </div>

                  {detailPackage.connectionAmount !== undefined &&
                    (detailPackage.packageType === 'Paid' || !detailPackage.description) && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground">
                        {detailPackage.packageType === 'Freemium' ? 'Số lượt/tuần' : 'Số lượt kết nối'}
                      </Label>
                      <div className="text-xl font-bold text-success">
                        {detailPackage.connectionAmount.toLocaleString('vi-VN')} lượt
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Loại gói</Label>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        detailPackage.packageType === 'Paid'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {detailPackage.packageType === 'Paid' ? 'Trả phí' : 'Miễn phí'}
                    </span>
                  </div>

                  {detailPackage.isActive !== undefined && (
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-muted-foreground">Trạng thái</Label>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          detailPackage.isActive
                            ? 'bg-success/10 text-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {detailPackage.isActive ? 'Đang hoạt động' : 'Đã ngưng'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="pt-4">
            {detailPackage?.isActive && (
              <Button
                variant="outline"
                onClick={() => {
                  handleCloseDetailDialog()
                  handleInactivateClick(detailPackage.packageId)
                }}
                className="text-warning hover:text-warning"
              >
                <PowerOff className="mr-2 h-4 w-4" />
                Ngưng hoạt động
              </Button>
            )}
            <Button variant="outline" onClick={handleCloseDetailDialog}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inactivate Confirmation Dialog */}
      <AlertDialog
        open={inactivateDialogOpen}
        onOpenChange={open => {
          setInactivateDialogOpen(open)
          if (!open) {
            setPackageToInactivate(null)
          }
        }}
      >
        <AlertDialogContent className="bg-background dark:bg-background border-2 border-border dark:border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận ngưng hoạt động</AlertDialogTitle>
            <AlertDialogDescription>
              Gói thanh toán sẽ không còn hiển thị với người dùng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isInactivating}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleInactivateConfirm}
              disabled={isInactivating}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              {isInactivating ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Đang xử lý...
                </>
              ) : (
                'Ngưng hoạt động'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

