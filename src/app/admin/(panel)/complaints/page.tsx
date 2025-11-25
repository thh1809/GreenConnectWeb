"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { complaints, type ComplaintStatus, type ComplaintData } from "@/lib/api/complaints"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { ChevronLeft, ChevronRight } from "lucide-react"

const getStatusColor = (status: ComplaintStatus) => {
  switch (status) {
    case "InProgress":
      return "bg-primary text-primary-foreground"
    case "Resolved":
      return "bg-primary/60 text-white"
    case "Rejected":
      return "bg-danger text-white"
    case "Submitted":
    default:
      return "bg-warning/20 text-warning-update"
  }
}

const formatStatus = (status: ComplaintStatus): string => {
  switch (status) {
    case "Submitted":
      return "Pending"
    case "InProgress":
      return "In Progress"
    case "Resolved":
      return "Resolved"
    case "Rejected":
      return "Rejected"
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

  const fetchComplaints = async () => {
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
      setError(err instanceof Error ? err.message : "Failed to load complaints")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [currentPage, statusFilter])

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
        <h1 className="text-3xl font-bold leading-tight">Complaints</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Manage and resolve user complaints
        </p>
      </div>

      {/* Filter Section */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Filter by Status:</label>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-40 border-primary">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Submitted">Pending</SelectItem>
            <SelectItem value="InProgress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Complaints Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          ) : complaintsData.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No complaints found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="h-12 px-4 font-semibold">Title</TableHead>
                    <TableHead className="h-12 px-4 font-semibold">Accused</TableHead>
                    <TableHead className="h-12 px-4 font-semibold">User</TableHead>
                    <TableHead className="h-12 px-4 font-semibold">Status</TableHead>
                    <TableHead className="h-12 px-4 font-semibold">Date</TableHead>
                    <TableHead className="h-12 px-4 font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaintsData.map((complaint) => (
                    <TableRow key={complaint.complaintId} className="border-b">
                      <TableCell className="px-4 py-4">{complaint.reason}</TableCell>
                      <TableCell className="px-4 py-4">{complaint.accused.fullName}</TableCell>
                      <TableCell className="px-4 py-4">{complaint.complainant.fullName}</TableCell>
                      <TableCell className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {formatStatus(complaint.status)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        {formatDate(complaint.createdAt)}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Link href={`/admin/complaints/${complaint.complaintId}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-primary hover:text-primary hover:underline"
                          >
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && !error && complaintsData.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="text-xs text-muted-foreground">
            Hiển thị {complaintsData.length} / {totalRecords} hồ sơ
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
    </div>
  )
}

