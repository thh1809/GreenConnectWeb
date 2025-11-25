import { get, post, patch, del } from './client';

export interface RewardItem {
  rewardItemId: number;
  itemName: string;
  description: string | null;
  pointsCost: number; // API response uses pointsCost
  pointCost?: number; // Keep for backward compatibility
  imageUrl?: string | null;
  stockQuantity?: number | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface RewardItemsResponse {
  data: RewardItem[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface CreateRewardItemRequest {
  itemName: string;
  description?: string;
  pointsCost: number; // API uses pointsCost
  imageUrl?: string;
  stockQuantity?: number;
  isActive?: boolean;
}

export interface UpdateRewardItemRequest {
  itemName?: string;
  description?: string;
  pointsCost?: number; // API uses pointsCost
  imageUrl?: string;
  stockQuantity?: number;
  isActive?: boolean;
}

export const rewardItems = {
  getAll: (params?: {
    pageNumber?: number;
    pageSize?: number;
  }): Promise<RewardItemsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.pageNumber) {
      searchParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/reward-items${queryString ? `?${queryString}` : ''}`;
    
    return get<RewardItemsResponse>(endpoint);
  },
  
  getById: (id: number): Promise<RewardItem> => {
    return get<RewardItem>(`/api/v1/reward-items/${id}`);
  },
  
  create: (data: CreateRewardItemRequest): Promise<RewardItem> => {
    return post<RewardItem>('/api/v1/reward-items', data);
  },
  
  update: (id: number, data: UpdateRewardItemRequest): Promise<RewardItem> => {
    return patch<RewardItem>(`/api/v1/reward-items/${id}`, data);
  },
  
  delete: (id: number): Promise<void> => {
    return del<void>(`/api/v1/reward-items/${id}`);
  },
};

