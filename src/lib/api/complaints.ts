import { get, patch } from './client';

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

export interface ComplaintData {
  complaintId: string;
  transactionId: string;
  transaction: any; // Complex nested structure
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

export interface ComplaintDetail extends ComplaintData {
  transaction: {
    transactionId: string;
    householdId: string;
    household: ComplaintUser;
    scrapCollectorId: string;
    scrapCollector: ComplaintUser;
    offerId: string;
    offer: {
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
        scrapPostDetails: any[];
      };
      status: string;
      createdAt: string;
      offerDetails: Array<{
        offerDetailId: string;
        collectionOfferId: string;
        scrapCategoryId: number;
        scrapCategory: any;
        pricePerUnit: number;
        unit: string;
      }>;
      scheduleProposals: Array<{
        scheduleProposalId: string;
        collectionOfferId: string;
        collectionOffer: any;
        proposedTime: string;
        status: string;
        createdAt: string;
        responseMessage: string;
      }>;
    };
    status: number;
    scheduledTime: string | null;
    checkInTime: string | null;
    createdAt: string;
    updatedAt: string | null;
    transactionDetails: any[];
    totalPrice: number;
  };
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
    const endpoint = `/api/v1/complaints${queryString ? `?${queryString}` : ''}`;
    
    return get<ComplaintsResponse>(endpoint);
  },
  
  getById: (id: string): Promise<ComplaintDetail> => {
    return get<ComplaintDetail>(`/api/v1/complaints/${id}`);
  },
  
  processComplaint: (id: string, isAccept: boolean, reviewerNote?: string): Promise<string> => {
    const searchParams = new URLSearchParams();
    searchParams.append('isAccept', isAccept.toString());
    if (reviewerNote) {
      searchParams.append('reviewerNote', reviewerNote);
    }
    
    return patch<string>(`/api/v1/complaints/${id}/process?${searchParams.toString()}`);
  },
};

