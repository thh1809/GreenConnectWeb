"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { complaints, type ComplaintStatus, type ComplaintData } from "@/lib/api/complaints"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react"

const getStatusBadgeVariant = (status: ComplaintStatus): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "InProgress":
      return "default"
    case "Resolved":
      return "secondary"
    case "Rejected":
      return "destructive"
    case "Submitted":
    default:
      return "outline"
  }
}

const formatStatus = (status: ComplaintStatus): string => {
  switch (status) {
    case "Submitted":
      return "Đang chờ"
    case "InProgress":
      return "Đang xử lý"
    case "Resolved":
      return "Đã giải quyết"
    case "Rejected":
      return "Đã từ chối"
    default:
      return status
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}/${month}/${year}`
}

export default function ComplaintsPage() {
  const [complaintsData, setComplaintsData] = useState<ComplaintData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all")

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await complaints.getAll({
        pageNumber: currentPage,
        pageSize,
        sortByCreatedAt: true,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
      setComplaintsData(response.data)
      setTotalPages(response.pagination.totalPages)
      setTotalRecords(response.pagination.totalRecords)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải danh sách khiếu nại"
      setError(errorMessage)
      toast.error('Lỗi', {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, statusFilter])

  useEffect(() => {
    fetchComplaints()
  }, [fetchComplaints])

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as ComplaintStatus | "all")
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold leading-tight">Khiếu nại</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Quản lý và xử lý khiếu nại từ người dùng
        </p>
      </div>

      {/* Complaints Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Lọc theo trạng thái:</label>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-40 border-primary select-text">
                <SelectValue placeholder="Tất cả trạng thái" className="select-text" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Submitted">Đang chờ</SelectItem>
                <SelectItem value="InProgress">Đang xử lý</SelectItem>
                <SelectItem value="Resolved">Đã giải quyết</SelectItem>
                <SelectItem value="Rejected">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-4 p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Người bị tố cáo</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : complaintsData.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Không tìm thấy khiếu nại nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="h-12 px-4 font-semibold">Tiêu đề</TableHead>
                    <TableHead className="h-12 px-4 font-semibold">Người bị tố cáo</TableHead>
                    <TableHead className="h-12 px-4 font-semibold">Người dùng</TableHead>
                    <TableHead className="h-12 px-4 font-semibold">Trạng thái</TableHead>
                    <TableHead className="h-12 px-4 font-semibold">Ngày</TableHead>
                    <TableHead className="h-12 px-4 font-semibold">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaintsData.map((complaint) => (
                    <TableRow key={complaint.complaintId} className="border-b">
                      <TableCell className="px-4 py-4">{complaint.reason}</TableCell>
                      <TableCell className="px-4 py-4">{complaint.accused.fullName}</TableCell>
                      <TableCell className="px-4 py-4">{complaint.complainant.fullName}</TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge variant={getStatusBadgeVariant(complaint.status)}>
                          {formatStatus(complaint.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        {formatDate(complaint.createdAt)}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/admin/complaints/${complaint.complaintId}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-primary hover:text-primary hover:underline"
                                >
                                  Xem
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xem chi tiết khiếu nại</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && !error && complaintsData.length > 0 && (
            <div className="flex flex-col items-center gap-4 border-t pt-4 sm:flex-row sm:justify-end">
              <div className="text-sm text-muted-foreground sm:mr-auto">
                Hiển thị {complaintsData.length} / {totalRecords} hồ sơ
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
        </CardContent>
      </Card>
    </div>
  )
}

