'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MediateComplaintDialog } from '@/page/admin/components/mediate-complaint-dialog'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, Download, User, Phone, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import { complaints, type ComplaintDetail, type ComplaintStatus } from '@/lib/api/complaints'

const getStatusColor = (status: ComplaintStatus) => {
  switch (status) {
    case 'InProgress':
      return 'bg-primary text-primary-foreground'
    case 'Resolved':
      return 'bg-primary/60 text-white'
    case 'Rejected':
      return 'bg-danger text-white'
    case 'Submitted':
    default:
      return 'bg-warning/20 text-warning-update'
  }
}

const formatStatus = (status: ComplaintStatus): string => {
  switch (status) {
    case 'Submitted':
      return 'Pending'
    case 'InProgress':
      return 'In Progress'
    case 'Resolved':
      return 'Resolved'
    case 'Rejected':
      return 'Rejected'
    default:
      return status
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}/${month}/${year}`
}

export default function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [mediateDialogOpen, setMediateDialogOpen] = useState(false)
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = use(params)

  const fetchComplaint = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await complaints.getById(id)
      setComplaint(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load complaint')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchComplaint()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleMediateSubmit = async (isAccept: boolean, notes: string) => {
    if (!complaint) return

    try {
      await complaints.processComplaint(complaint.complaintId, isAccept, notes)
      // Refresh complaint data after processing
      await fetchComplaint()
      setMediateDialogOpen(false)
    } catch (err) {
      throw err // Re-throw to let dialog handle error display
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (error || !complaint) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">
            {error ? 'Error Loading Complaint' : 'Complaint Not Found'}
          </h1>
          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}
          <Link href="/admin/complaints">
            <Button variant="ghost" size="sm" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Complaints
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <Link href="/admin/complaints">
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Complaints
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold leading-tight">
              Complaint Details
            </h1>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                complaint.status
              )}`}
            >
              {formatStatus(complaint.status)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            reported by {complaint.complainant.fullName} on{' '}
            {formatDate(complaint.createdAt)}
          </p>
        </div>
        <Button
          variant="primary"
          className="shrink-0"
          onClick={() => setMediateDialogOpen(true)}
        >
          Mediate
        </Button>
      </div>

      {/* Complaint Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Complaint Reason</label>
        <div className="rounded-md border border-border bg-muted/30 p-4 text-sm">
          {complaint.reason}
        </div>
      </div>

      {/* User Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Complainant */}
        <div className="rounded-md border border-border bg-muted/30 p-4">
          <h3 className="mb-3 text-sm font-semibold">Người khiếu nại (Complainant)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{complaint.complainant.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{complaint.complainant.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Hạng:</span>
              <span>{complaint.complainant.rank}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Role:</span>
              <span>
                {complaint.complainant.roles?.length
                  ? complaint.complainant.roles.join(', ')
                  : 'Chưa gán'}
              </span>
            </div>
          </div>
        </div>

        {/* Accused */}
        <div className="rounded-md border border-border bg-muted/30 p-4">
          <h3 className="mb-3 text-sm font-semibold">Người bị tố cáo (Accused)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{complaint.accused.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{complaint.accused.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Hạng:</span>
              <span>{complaint.accused.rank}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Role:</span>
              <span>
                {complaint.accused.roles?.length
                  ? complaint.accused.roles.join(', ')
                  : 'Chưa gán'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Information */}
      {complaint.transaction && (
        <div className="rounded-md border border-border bg-muted/30 p-4">
          <h3 className="mb-3 text-sm font-semibold">Thông tin giao dịch (Transaction)</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Transaction ID:</span>{' '}
                <span className="font-mono text-xs">
                  {complaint.transaction.transactionId}
                </span>
              </div>
              {complaint.transaction.offer?.scrapPost && (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {complaint.transaction.offer.scrapPost.title}
                    </div>
                    <div className="text-muted-foreground">
                      {complaint.transaction.offer.scrapPost.address}
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span>
                  {complaint.transaction.createdAt
                    ? formatDate(complaint.transaction.createdAt)
                    : 'N/A'}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Status:</span>{' '}
                <span>{complaint.transaction.status}</span>
              </div>
              {complaint.transaction.totalPrice !== undefined && (
                <div>
                  <span className="text-muted-foreground">Total Price:</span>{' '}
                  <span>{complaint.transaction.totalPrice.toLocaleString()} VNĐ</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="evidence">
        <TabsList>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="transaction">Transaction Details</TabsTrigger>
        </TabsList>

        <TabsContent value="evidence" className="mt-4">
          {complaint.evidenceUrl ? (
            <div className="space-y-3">
              <div className="rounded-md border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Evidence File</span>
                  <a
                    href={complaint.evidenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/20"
                  >
                    <Download className="h-4 w-4" />
                    Download Evidence
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              No evidence uploaded yet.
            </div>
          )}
        </TabsContent>

        <TabsContent value="transaction" className="mt-4">
          {complaint.transaction ? (
            <div className="space-y-4 rounded-md border border-border bg-muted/30 p-4">
              <div className="text-sm">
                <div className="mb-2 font-semibold">Offer Details:</div>
                {complaint.transaction.offer?.offerDetails?.length > 0 ? (
                  <div className="space-y-2">
                    {complaint.transaction.offer.offerDetails.map((detail, idx) => (
                      <div
                        key={idx}
                        className="rounded-md bg-background p-2 text-xs"
                      >
                        Category ID: {detail.scrapCategoryId} - Price:{' '}
                        {detail.pricePerUnit.toLocaleString()} VNĐ/{detail.unit}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No offer details available</div>
                )}
              </div>
              {complaint.transaction.offer?.scheduleProposals?.length > 0 && (
                <div className="text-sm">
                  <div className="mb-2 font-semibold">Schedule Proposals:</div>
                  <div className="space-y-2">
                    {complaint.transaction.offer.scheduleProposals.map((proposal, idx) => (
                      <div
                        key={idx}
                        className="rounded-md bg-background p-2 text-xs"
                      >
                        <div>Proposed Time: {formatDate(proposal.proposedTime)}</div>
                        <div>Status: {proposal.status}</div>
                        {proposal.responseMessage && (
                          <div>Response: {proposal.responseMessage}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-md border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              No transaction details available.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Mediate Complaint Dialog */}
      <MediateComplaintDialog
        open={mediateDialogOpen}
        onOpenChange={setMediateDialogOpen}
        onSubmit={handleMediateSubmit}
      />
    </div>
  )
}

