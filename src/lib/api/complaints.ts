import { get, patch } from './client';
import { API_ENDPOINTS, COMPLAINT_STATUS } from '@/lib/constants';

export type ComplaintStatus = 'Submitted' | 'InProgress' | 'Resolved' | 'Rejected';

export interface ComplaintUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  pointBalance: number;
  rank: string;
  roles: string[];
  avatarUrl: string | null;
}

export interface ScrapPostDetail {
  scrapPostDetailId: string;
  scrapPostId: string;
  scrapCategoryId: number;
  quantity: number;
  unit: string;
}

export interface ScrapCategory {
  scrapCategoryId: number;
  categoryName: string;
  description?: string;
}

export interface TransactionDetail {
  transactionDetailId: string;
  transactionId: string;
  scrapCategoryId: number;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface ComplaintTransaction {
  transactionId: string;
  householdId: string;
  household: ComplaintUser;
  scrapCollectorId: string;
  scrapCollector: ComplaintUser;
  offerId: string;
  status: number;
  scheduledTime: string | null;
  checkInTime: string | null;
  createdAt: string;
  updatedAt: string | null;
  transactionDetails: TransactionDetail[];
  totalPrice: number;
}

export interface ComplaintData {
  complaintId: string;
  transactionId: string;
  transaction: ComplaintTransaction | Record<string, unknown>;
  complainantId: string;
  complainant: ComplaintUser;
  accusedId: string;
  accused: ComplaintUser;
  reason: string;
  evidenceUrl: string | null;
  status: ComplaintStatus;
  createdAt: string;
}

export interface ComplaintsResponse {
  data: ComplaintData[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface GetComplaintsParams {
  pageNumber?: number;
  pageSize?: number;
  sortByCreatedAt?: boolean;
  status?: ComplaintStatus;
}

export interface CollectionOffer {
  collectionOfferId: string;
  scrapPostId: string;
  scrapPost: {
    scrapPostId: string;
    title: string;
    description: string;
    address: string;
    availableTimeRange: string | null;
    status: string;
    createdAt: string;
    updatedAt: string | null;
    householdId: string;
    household: ComplaintUser | null;
    mustTakeAll: boolean;
    scrapPostDetails: ScrapPostDetail[];
  };
  status: string;
  createdAt: string;
  offerDetails: Array<{
    offerDetailId: string;
    collectionOfferId: string;
    scrapCategoryId: number;
    scrapCategory: ScrapCategory;
    pricePerUnit: number;
    unit: string;
  }>;
  scheduleProposals: Array<{
    scheduleProposalId: string;
    collectionOfferId: string;
    collectionOffer: CollectionOffer;
    proposedTime: string;
    status: string;
    createdAt: string;
    responseMessage: string;
  }>;
}

export interface ComplaintDetailTransaction extends ComplaintTransaction {
  offer: CollectionOffer;
}

export interface ComplaintDetail extends Omit<ComplaintData, 'transaction'> {
  transaction: ComplaintDetailTransaction;
}

export const complaints = {
  getAll: (params?: GetComplaintsParams): Promise<ComplaintsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.pageNumber) {
      searchParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.sortByCreatedAt !== undefined) {
      searchParams.append('sortByCreatedAt', params.sortByCreatedAt.toString());
    }
    if (params?.status) {
      searchParams.append('status', params.status);
    }

    const queryString = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.COMPLAINTS}${queryString ? `?${queryString}` : ''}`;
    
    return get<ComplaintsResponse>(endpoint);
  },
  
  getById: (id: string): Promise<ComplaintDetail> => {
    return get<ComplaintDetail>(`${API_ENDPOINTS.COMPLAINTS}/${id}`);
  },
  
  processComplaint: (id: string, isAccept: boolean, reviewerNote?: string): Promise<string> => {
    const searchParams = new URLSearchParams();
    searchParams.append('isAccept', isAccept.toString());
    if (reviewerNote) {
      searchParams.append('reviewerNote', reviewerNote);
    }
    
    return patch<string>(`${API_ENDPOINTS.COMPLAINTS}/${id}/process?${searchParams.toString()}`);
  },
};

