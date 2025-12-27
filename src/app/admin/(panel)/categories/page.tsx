"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Search, Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { categories as categoriesApi, type ScrapCategory } from "@/lib/api/categories"
import { files as filesApi } from "@/lib/api/files"

export default function CategoriesPage() {
  const [categoriesData, setCategoriesData] = useState<ScrapCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ScrapCategory | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  const [localImagePreviewUrl, setLocalImagePreviewUrl] = useState<string | null>(null)
  const [remoteImagePreviewUrl, setRemoteImagePreviewUrl] = useState<string | null>(null)

  const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [imagePreviewAlt, setImagePreviewAlt] = useState<string | null>(null)

  
  const openImagePreview = (url: string, alt: string) => {
    setImagePreviewUrl(url)
    setImagePreviewAlt(alt)
    setImagePreviewOpen(true)
  }

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await categoriesApi.getAll({
        pageNumber: currentPage,
        pageSize,
      })
      setCategoriesData(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalRecords(response.pagination.totalRecords)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải danh sách danh mục"
      setError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleOpenDialog = (category?: ScrapCategory) => {
    if (category) {
      setEditingCategory(category)
      setCategoryName(category.categoryName)
      setImageUrl(category.imagePath ?? null)
      setRemoteImagePreviewUrl(category.imageUrl ?? null)
      setImageFile(null)
    } else {
      setEditingCategory(null)
      setCategoryName("")
      setImageUrl(null)
      setRemoteImagePreviewUrl(null)
      setImageFile(null)
    }
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingCategory(null)
    setCategoryName("")
    setImageUrl(null)
    setImageFile(null)
    setRemoteImagePreviewUrl(null)
    if (localImagePreviewUrl && localImagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(localImagePreviewUrl)
    }
    setLocalImagePreviewUrl(null)
    setDialogError(null)
  }

  const deriveBucketObjectPathFromUploadUrl = (uploadUrl: string): string | null => {
    try {
      const u = new URL(uploadUrl)

      // Common GCS signed URL: https://storage.googleapis.com/<bucket>/<object>
      if (u.hostname === 'storage.googleapis.com') {
        const parts = u.pathname.split('/').filter(Boolean)
        if (parts.length >= 2) {
          const bucket = parts[0]
          const objectKey = parts.slice(1).join('/')
          return `${bucket}/${objectKey}`
        }
      }

      // Firebase Storage URL style: https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<object>
      if (u.hostname === 'firebasestorage.googleapis.com') {
        const parts = u.pathname.split('/').filter(Boolean)
        const bIdx = parts.indexOf('b')
        const oIdx = parts.indexOf('o')
        if (bIdx >= 0 && oIdx >= 0 && parts[bIdx + 1] && parts[oIdx + 1]) {
          const bucket = parts[bIdx + 1]
          const objectKey = decodeURIComponent(parts.slice(oIdx + 1).join('/'))
          return `${bucket}/${objectKey}`
        }
      }
    } catch {
      // ignore
    }

    return null
  }

  const handleSaveCategory = async () => {
    const trimmedName = categoryName.trim()
    const trimmedImageUrl = imageUrl?.trim() ?? ""
    
    if (!trimmedName) {
      setDialogError('Tên danh mục không được để trống')
      return
    }

    try {
      setIsSubmitting(true)
      setDialogError(null)

      let uploadedFilePath: string | null = null

      if (imageFile) {
        const uploadInfo = await filesApi.getScrapCategoryUploadUrl({
          fileName: imageFile.name,
          contentType: imageFile.type || 'application/octet-stream',
        })

        await filesApi.uploadBinaryToUrl(uploadInfo.uploadUrl, imageFile)
        // Prefer a stable bucket/object path so GET can map to a working public URL
        const fp = String(uploadInfo.filePath ?? '').trim()
        if (fp.includes('/')) {
          uploadedFilePath = fp
        } else {
          uploadedFilePath = deriveBucketObjectPathFromUploadUrl(uploadInfo.uploadUrl) ?? fp
        }
      }

      if (!uploadedFilePath && !trimmedImageUrl) {
        setDialogError('Vui lòng chọn ảnh')
        return
      }
      
      const effectivePath = uploadedFilePath ?? trimmedImageUrl
      const payload = {
        categoryName: trimmedName,
        stringUrl: effectivePath,
      }
      
      if (editingCategory) {
        // Update existing category (PUT)
        await categoriesApi.update(editingCategory.scrapCategoryId, payload)
      } else {
        // Create new category (POST)
        await categoriesApi.create(payload)
      }
      
      await fetchCategories()
      handleCloseDialog()
      toast.success('Thành công', {
        description: editingCategory ? 'Đã cập nhật danh mục thành công' : 'Đã tạo danh mục thành công',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể lưu danh mục"
      setDialogError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (categoryToDelete === null) return

    try {
      await categoriesApi.delete(categoryToDelete)
      await fetchCategories()
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
      toast.success('Thành công', {
        description: 'Đã xóa danh mục thành công',
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể xóa danh mục"
      setError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredCategories = categoriesData.filter(category =>
    String(category.categoryName ?? '').toLowerCase().includes(normalizedQuery)
  )

  return (
    <div className="space-y-6">
      <Dialog
        open={imagePreviewOpen}
        onOpenChange={(open) => {
          setImagePreviewOpen(open)
          if (!open) {
            setImagePreviewUrl(null)
            setImagePreviewAlt(null)
          }
        }}
      >
        <DialogContent className="max-w-3xl bg-background dark:bg-background border-2 border-border dark:border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Xem ảnh</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {imagePreviewAlt || 'Ảnh danh mục'}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto rounded-lg border bg-muted/10 p-3">
            {imagePreviewUrl ? (
              <img
                src={imagePreviewUrl}
                alt={imagePreviewAlt || 'Category image'}
                className="w-full h-auto rounded-md object-contain"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold leading-tight">Danh mục</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Quản lý danh mục ve chai và phế liệu
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          if (open) {
            handleOpenDialog()
          } else {
            handleCloseDialog()
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="default" className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Thêm danh mục mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl bg-background dark:bg-background border-2 border-border dark:border-border">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-2xl font-bold">
                {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingCategory
                  ? "Cập nhật thông tin danh mục bên dưới."
                  : "Nhập thông tin để tạo danh mục mới."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category-name" className="text-sm font-semibold">
                  Tên danh mục <span className="text-danger">*</span>
                </Label>
                <Input
                  id="category-name"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Nhập tên danh mục"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-description" className="text-sm font-semibold">
                  Ảnh
                </Label>
                <Input
                  id="category-description"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null
                    setImageFile(f)

                    if (localImagePreviewUrl && localImagePreviewUrl.startsWith('blob:')) {
                      URL.revokeObjectURL(localImagePreviewUrl)
                    }

                    if (!f) {
                      setLocalImagePreviewUrl(null)
                      return
                    }

                    const url = URL.createObjectURL(f)
                    setLocalImagePreviewUrl(url)
                  }}
                  className="bg-background"
                />
                {((imageFile && localImagePreviewUrl) || remoteImagePreviewUrl) && (
                  <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="text-xs text-muted-foreground mb-2">Xem trước</div>
                    <img
                      src={imageFile ? (localImagePreviewUrl ?? undefined) : (remoteImagePreviewUrl ?? undefined)}
                      alt={categoryName || 'Category image'}
                      className="h-28 w-full rounded-md object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  </div>
                )}
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
                onClick={handleSaveCategory}
                disabled={!categoryName.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category List Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Danh sách danh mục</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-2xl lg:max-w-3xl">
            <Input
              placeholder="Tìm kiếm theo tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="space-y-4 p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên danh mục</TableHead>
                    <TableHead>Image URL</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "Không tìm thấy danh mục nào" : "Chưa có danh mục nào"}
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tên danh mục</TableHead>
                      <TableHead>Image </TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.scrapCategoryId}>
                        <TableCell className="font-medium">
                          {category.scrapCategoryId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {category.categoryName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {category.imageUrl ? (
                            <button
                              type="button"
                              className="inline-flex items-center justify-center"
                              onClick={() => openImagePreview(category.imageUrl as string, category.categoryName)}
                            >
                              <img
                                src={category.imageUrl}
                                alt={category.categoryName}
                                className="h-10 w-10 rounded-md object-cover border"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                                }}
                              />
                            </button>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="outline"
                                    aria-label="Edit"
                                    className="h-8 w-8"
                                    onClick={() => handleOpenDialog(category)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Chỉnh sửa danh mục</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="destructive"
                                    aria-label="Delete"
                                    className="h-8 w-8"
                                    onClick={() => handleDeleteClick(category.scrapCategoryId)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Xóa danh mục</p>
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
              {!searchQuery && (
                <div className="flex flex-col items-center gap-4 border-t pt-4 sm:flex-row sm:justify-end">
                  <div className="text-sm text-muted-foreground sm:mr-auto">
                    Hiển thị {categoriesData.length} / {totalRecords} danh mục
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
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            setCategoryToDelete(null)
          }
        }}
      >
        <AlertDialogContent className="bg-background dark:bg-background border-2 border-border dark:border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
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

