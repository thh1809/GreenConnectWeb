"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Search, Pencil, Trash2, Plus, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { rewardItems as rewardItemsApi, type RewardItem } from "@/lib/api/reward-items"

export default function RewardItemsPage() {
  const [rewardItemsData, setRewardItemsData] = useState<RewardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RewardItem | null>(null)
  const [itemName, setItemName] = useState("")
  const [description, setDescription] = useState("")
  const [pointCost, setPointCost] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  // Detail dialog state
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailItem, setDetailItem] = useState<RewardItem | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)

  const fetchRewardItems = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await rewardItemsApi.getAll({
        pageNumber: currentPage,
        pageSize,
      })
      setRewardItemsData(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalRecords(response.pagination.totalRecords)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reward items")
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    fetchRewardItems()
  }, [fetchRewardItems])

  const handleOpenDialog = (item?: RewardItem) => {
    if (item) {
      setEditingItem(item)
      setItemName(item.itemName)
      setDescription(item.description || "")
      setPointCost((item.pointsCost || item.pointCost || 0).toString())
      setImageUrl(item.imageUrl || "")
      setStockQuantity(item.stockQuantity?.toString() || "")
      setIsActive(item.isActive ?? true)
    } else {
      setEditingItem(null)
      setItemName("")
      setDescription("")
      setPointCost("")
      setImageUrl("")
      setStockQuantity("")
      setIsActive(true)
    }
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingItem(null)
    setItemName("")
    setDescription("")
    setPointCost("")
    setImageUrl("")
    setStockQuantity("")
    setIsActive(true)
    setDialogError(null)
  }

  const handleSaveItem = async () => {
    if (!itemName.trim() || !pointCost.trim()) return

    const pointCostNum = parseInt(pointCost)
    if (isNaN(pointCostNum) || pointCostNum < 0) {
      setDialogError("Điểm đổi thưởng phải là số nguyên dương")
      return
    }

    try {
      setIsSubmitting(true)
      setDialogError(null)
      
      const payload: any = {
        itemName: itemName.trim(),
        pointsCost: pointCostNum, // API uses pointsCost
        isActive,
      }

      if (description.trim()) {
        payload.description = description.trim()
      }
      if (imageUrl.trim()) {
        payload.imageUrl = imageUrl.trim()
      }
      if (stockQuantity.trim()) {
        const stockNum = parseInt(stockQuantity)
        if (!isNaN(stockNum) && stockNum >= 0) {
          payload.stockQuantity = stockNum
        }
      }
      
      if (editingItem) {
        // Update existing item
        await rewardItemsApi.update(editingItem.rewardItemId, payload)
      } else {
        // Create new item
        await rewardItemsApi.create(payload)
      }
      
      await fetchRewardItems()
      handleCloseDialog()
    } catch (err) {
      setDialogError(err instanceof Error ? err.message : "Không thể lưu vật phẩm đổi thưởng")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return

    try {
      await rewardItemsApi.delete(itemToDelete)
      await fetchRewardItems()
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete reward item")
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const filteredItems = rewardItemsData.filter(item =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewDetail = async (id: number) => {
    try {
      setDetailLoading(true)
      setDetailError(null)
      const item = await rewardItemsApi.getById(id)
      setDetailItem(item)
      setDetailDialogOpen(true)
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Failed to load item details")
    } finally {
      setDetailLoading(false)
    }
  }

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false)
    setDetailItem(null)
    setDetailError(null)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold leading-tight">Reward Items</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Quản lý vật phẩm đổi thưởng
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
              Thêm vật phẩm mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl bg-card">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-2xl font-bold">
                {editingItem ? "Chỉnh sửa vật phẩm" : "Thêm vật phẩm mới"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {editingItem
                  ? "Cập nhật thông tin vật phẩm đổi thưởng bên dưới."
                  : "Nhập thông tin để tạo vật phẩm đổi thưởng mới."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="item-name" className="text-sm font-semibold">
                  Tên vật phẩm <span className="text-danger">*</span>
                </Label>
                <Input
                  id="item-name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Nhập tên vật phẩm"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item-description" className="text-sm font-semibold">
                  Mô tả
                </Label>
                <Textarea
                  id="item-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Nhập mô tả (tùy chọn)"
                  className="min-h-[100px] resize-none bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="point-cost" className="text-sm font-semibold">
                  Điểm đổi thưởng <span className="text-danger">*</span>
                </Label>
                <Input
                  id="point-cost"
                  type="number"
                  min="0"
                  value={pointCost}
                  onChange={(e) => setPointCost(e.target.value)}
                  placeholder="Nhập số điểm"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-url" className="text-sm font-semibold">
                  URL hình ảnh
                </Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Nhập URL hình ảnh (tùy chọn)"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock-quantity" className="text-sm font-semibold">
                  Số lượng tồn kho
                </Label>
                <Input
                  id="stock-quantity"
                  type="number"
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="Nhập số lượng (tùy chọn)"
                  className="bg-background"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is-active" className="text-sm font-semibold">
                  Trạng thái hoạt động
                </Label>
                <Switch
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
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
                onClick={handleSaveItem}
                disabled={!itemName.trim() || !pointCost.trim() || isSubmitting}
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

      {/* Reward Items List Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Danh sách vật phẩm đổi thưởng</CardTitle>
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
          ) : filteredItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              {searchQuery ? "Không tìm thấy vật phẩm nào" : "Chưa có vật phẩm nào"}
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="h-12 px-4 font-semibold">ID</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Tên vật phẩm</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Điểm đổi</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Tồn kho</TableHead>
                      <TableHead className="h-12 px-4 font-semibold">Trạng thái</TableHead>
                      <TableHead className="h-12 px-4 text-right font-semibold">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.rewardItemId} className="border-b">
                        <TableCell className="px-4 py-4 font-medium">
                          #{item.rewardItemId}
                        </TableCell>
                        <TableCell className="px-4 py-4 font-medium">
                          {item.itemName}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <span className="font-semibold text-primary">{item.pointsCost || item.pointCost || 0}</span> điểm
                        </TableCell>
                        <TableCell className="px-4 py-4 text-muted-foreground">
                          {item.stockQuantity !== null && item.stockQuantity !== undefined ? item.stockQuantity : "Không giới hạn"}
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              item.isActive !== false
                                ? "bg-success/10 text-success"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.isActive !== false ? "Hoạt động" : "Tạm ngưng"}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="icon-sm"
                              variant="outline"
                              aria-label="View"
                              className="h-8 w-8"
                              onClick={() => handleViewDetail(item.rewardItemId)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="outline"
                              aria-label="Edit"
                              className="h-8 w-8"
                              onClick={() => handleOpenDialog(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="destructive"
                              aria-label="Delete"
                              className="h-8 w-8"
                              onClick={() => handleDeleteClick(item.rewardItemId)}
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
                    Hiển thị {rewardItemsData.length} / {totalRecords} vật phẩm
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
            <DialogTitle className="text-2xl font-bold">Chi tiết vật phẩm đổi thưởng</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Thông tin chi tiết về vật phẩm đổi thưởng
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
          ) : detailItem ? (
            <div className="space-y-6">
              {/* Item Image */}
              {detailItem.imageUrl && (
                <div className="flex justify-center">
                  <div className="relative max-h-64 w-full">
                    <Image
                      src={detailItem.imageUrl}
                      alt={detailItem.itemName}
                      width={256}
                      height={256}
                      className="rounded-lg object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              )}

              {/* Item Details */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground">ID</Label>
                  <div className="text-base font-medium">#{detailItem.rewardItemId}</div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground">Tên vật phẩm</Label>
                  <div className="text-base font-semibold">{detailItem.itemName}</div>
                </div>

                {detailItem.description && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Mô tả</Label>
                    <div className="text-base text-muted-foreground whitespace-pre-wrap">
                      {detailItem.description}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-muted-foreground">Điểm đổi thưởng</Label>
                  <div className="text-base font-semibold text-primary">
                    {detailItem.pointsCost || detailItem.pointCost || 0} điểm
                  </div>
                </div>

                {detailItem.stockQuantity !== null && detailItem.stockQuantity !== undefined && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Số lượng tồn kho</Label>
                    <div className="text-base">{detailItem.stockQuantity}</div>
                  </div>
                )}

                {detailItem.isActive !== undefined && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Trạng thái</Label>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        detailItem.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {detailItem.isActive ? "Hoạt động" : "Tạm ngưng"}
                    </span>
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
            setItemToDelete(null)
          }
        }}
      >
        <AlertDialogContent className="bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vật phẩm đổi thưởng này? Hành động này không thể hoàn tác.
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

