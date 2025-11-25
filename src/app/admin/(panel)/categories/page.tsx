"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

  const fetchCategories = async () => {
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
      setError(err instanceof Error ? err.message : "Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [currentPage])

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
    if (!categoryName.trim()) return

    try {
      setIsSubmitting(true)
      setDialogError(null)
      
      if (editingCategory) {
        // Update existing category (PUT)
        await categoriesApi.update(editingCategory.scrapCategoryId, {
          categoryName: categoryName.trim(),
          description: description.trim() || undefined,
        })
      } else {
        // Create new category (POST)
        await categoriesApi.create({
          categoryName: categoryName.trim(),
          description: description.trim() || undefined,
        })
      }
      
      await fetchCategories()
      handleCloseDialog()
    } catch (err) {
      setDialogError(err instanceof Error ? err.message : "Không thể lưu danh mục")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return

    try {
      await categoriesApi.delete(id)
      await fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category")
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
          <h1 className="text-3xl font-bold leading-tight">Scrap Categories</h1>
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
            <Button variant="primary" className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Thêm danh mục mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl bg-card">
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
                  Mô tả
                </Label>
                <Textarea
                  id="category-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả (tùy chọn)"
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
                variant="primary"
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
          <div className="relative w-full sm:max-w-xs">
            <Input
              placeholder="Tìm kiếm theo tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background pl-9 pr-3"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                    <TableRow className="border-b">
                      <TableHead className="h-12 px-4 font-semibold">ID</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Tên danh mục</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Mô tả</TableHead>
                      <TableHead className="h-12 px-4 text-right font-semibold">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.scrapCategoryId} className="border-b">
                        <TableCell className="px-4 py-4 font-medium">
                          #{category.scrapCategoryId}
                        </TableCell>
                        <TableCell className="px-4 py-4 font-medium">
                          {category.categoryName}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-muted-foreground">
                          {category.description || "-"}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="icon-sm"
                              variant="outline"
                              aria-label="Edit"
                              className="h-8 w-8"
                              onClick={() => handleOpenDialog(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="destructive"
                              aria-label="Delete"
                              className="h-8 w-8"
                              onClick={() => handleDeleteCategory(category.scrapCategoryId)}
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
                    Hiển thị {categoriesData.length} / {totalRecords} danh mục
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
    </div>
  )
}

