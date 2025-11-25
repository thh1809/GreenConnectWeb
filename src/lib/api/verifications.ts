import { get, patch } from "./client"

export type AdminVerificationStatus = "PendingReview" | "Approved" | "Rejected"

export type AdminVerificationUser = {
  id: string
  fullName: string
  phoneNumber: string
  pointBalance: number
  rank: string
  roles: string[]
  avatarUrl: string | null
}

export type AdminVerificationItem = {
  userId: string
  user: AdminVerificationUser
  status: AdminVerificationStatus
  documentFrontUrl: string | null
  documentBackUrl: string | null
  submittedAt: string
}

export type AdminVerificationPagination = {
  totalRecords: number
  currentPage: number
  totalPages: number
  nextPage: number | null
  prevPage: number | null
}

export type AdminVerificationResponse = {
  data: AdminVerificationItem[]
  pagination: AdminVerificationPagination
}

export type AdminVerificationQuery = {
  pageNumber?: number
  pageSize?: number
  sortBySubmittedAt?: boolean
}

export const getAdminVerifications = (params: AdminVerificationQuery = {}) => {
  const searchParams = new URLSearchParams()

  if (params.pageNumber) {
    searchParams.set("pageNumber", params.pageNumber.toString())
  }
  if (params.pageSize) {
    searchParams.set("pageSize", params.pageSize.toString())
  }
  if (typeof params.sortBySubmittedAt === "boolean") {
    searchParams.set("sortBySubmittedAt", String(params.sortBySubmittedAt))
  }

  const queryString = searchParams.toString()
  const endpoint = `/api/v1/admin/verifications${queryString ? `?${queryString}` : ""}`

  return get<AdminVerificationResponse>(endpoint)
}

export type UpdateVerificationStatusPayload = {
  isAccepted: boolean
  reviewerNote?: string
}

export const updateAdminVerificationStatus = (
  userId: string,
  payload: UpdateVerificationStatusPayload
) => {
  const searchParams = new URLSearchParams()
  searchParams.set("isAccepted", String(payload.isAccepted))
  if (payload.reviewerNote) {
    searchParams.set("reviewerNote", payload.reviewerNote)
  }

  return patch<string>(`/api/v1/admin/verifications/${userId}/status?${searchParams.toString()}`)
}

