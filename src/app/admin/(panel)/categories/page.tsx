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
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Search, Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { categories as categoriesApi, type ScrapCategory } from "@/lib/api/categories"

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
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null)

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
      setDescription(category.description || "")
    } else {
      setEditingCategory(null)
      setCategoryName("")
      setDescription("")
    }
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingCategory(null)
    setCategoryName("")
    setDescription("")
    setDialogError(null)
  }

  const handleSaveCategory = async () => {
    const trimmedName = categoryName.trim()
    const trimmedDescription = description.trim()
    
    if (!trimmedName) {
      setDialogError('Tên danh mục không được để trống')
      return
    }

    if (!trimmedDescription) {
      setDialogError('Mô tả không được để trống')
      return
    }

    try {
      setIsSubmitting(true)
      setDialogError(null)
      
      const payload = {
        categoryName: trimmedName,
        description: trimmedDescription,
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

  const handleDeleteClick = (id: number) => {
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

  const filteredCategories = categoriesData.filter(category =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
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
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
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
                  Mô tả <span className="text-danger">*</span>
                </Label>
                <Textarea
                  id="category-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả"
                  className="min-h-[100px] resize-none bg-background"
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
                    <TableHead>Mô tả</TableHead>
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
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.scrapCategoryId}>
                        <TableCell className="font-medium">
                          #{category.scrapCategoryId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {category.categoryName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {category.description || "-"}
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
        <AlertDialogContent>
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

