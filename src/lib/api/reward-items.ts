import { get, post, put, patch, del } from './client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface RewardItem {
  rewardItemId: number;
  itemName: string;
  description: string | null;
  pointsCost: number; // API response uses pointsCost
  pointCost?: number; // Keep for backward compatibility
  imageUrl?: string | null;
  type?: string | null;
  value?: string | null;
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
  type?: string;
  value?: string;
  stockQuantity?: number;
  isActive?: boolean;
}

export interface UpdateRewardItemRequest {
  itemName?: string;
  description?: string;
  pointsCost?: number; // API uses pointsCost
  imageUrl?: string;
  type?: string;
  value?: string;
  stockQuantity?: number;
  isActive?: boolean;
}

export const rewardItems = {
  getAll: async (params?: {
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
    const endpoint = `${API_ENDPOINTS.REWARD_ITEMS}${queryString ? `?${queryString}` : ''}`;
    
    // API returns array directly, not wrapped in { data, pagination }
    const response = await get<RewardItem[]>(endpoint);
    
    // Wrap array response into expected structure
    const items = Array.isArray(response) ? response : [];
    const totalRecords = items.length;
    const currentPage = params?.pageNumber || 1;
    const pageSize = params?.pageSize || 10;
    const totalPages = Math.ceil(totalRecords / pageSize);
    
    return {
      data: items,
      pagination: {
        totalRecords,
        currentPage,
        totalPages,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
      },
    };
  },
  
  getById: (id: number): Promise<RewardItem> => {
    return get<RewardItem>(`${API_ENDPOINTS.REWARD_ITEMS_DETAIL}/${id}`);
  },
  
  create: (data: CreateRewardItemRequest): Promise<RewardItem> => {
    return post<RewardItem>(API_ENDPOINTS.REWARD_ITEMS, data);
  },
  
  update: (id: number, data: UpdateRewardItemRequest): Promise<RewardItem> => {
    return put<RewardItem>(`${API_ENDPOINTS.REWARD_ITEMS}/${id}`, data);
  },
  
  delete: (id: number): Promise<void> => {
    return del<void>(`${API_ENDPOINTS.REWARD_ITEMS}/${id}`);
  },
};

