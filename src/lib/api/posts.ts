import { get, del } from './client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface Household {
  id: string;
  fullName: string;
  phoneNumber: string;
  pointBalance: number;
  creditBalance: number;
  rank: string;
  roles: string[];
  avatarUrl: string | null;
}

export interface ScrapCategory {
  scrapCategoryId: number;
  categoryName: string;
  description: string | null;
}

export interface ScrapPostDetail {
  scrapCategoryId: number;
  scrapCategory: ScrapCategory;
  amountDescription: string;
  imageUrl: string | null;
  status: 'Available' | 'Booked' | 'Completed';
}

export interface ScrapPost {
  scrapPostId: string;
  householdId: string;
  household: Household;
  title: string;
  description: string;
  availableTimeRange: string;
  createdAt: string;
  updatedAt: string;
  status: 'Open' | 'PartiallyBooked' | 'FullyBooked' | 'Completed' | 'Canceled';
}

export interface ScrapPostFull {
  scrapPostId: string;
  title: string;
  description: string;
  address: string;
  availableTimeRange: string;
  status: 'Open' | 'PartiallyBooked' | 'FullyBooked' | 'Completed' | 'Canceled';
  createdAt: string;
  updatedAt: string;
  householdId: string;
  household: Household;
  mustTakeAll: boolean;
  scrapPostDetails: ScrapPostDetail[];
}

export interface PostsResponse {
  data: ScrapPost[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface GetPostsParams {
  categoryName?: string;
  status?: 'Open' | 'PartiallyBooked' | 'FullyBooked' | 'Completed' | 'Canceled';
  sortByLocation?: boolean;
  sortByCreateAt?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export const posts = {
  getAll: (params?: GetPostsParams): Promise<PostsResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.categoryName) {
      searchParams.append('categoryName', params.categoryName);
    }
    if (params?.status) {
      searchParams.append('status', params.status);
    }
    if (params?.sortByLocation !== undefined) {
      searchParams.append('sortByLocation', params.sortByLocation.toString());
    }
    if (params?.sortByCreateAt !== undefined) {
      searchParams.append('sortByCreateAt', params.sortByCreateAt.toString());
    }
    if (params?.pageNumber) {
      searchParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.POSTS}${queryString ? `?${queryString}` : ''}`;
    
    return get<PostsResponse>(endpoint);
  },

  getById: (id: string): Promise<ScrapPostFull> => {
    return get<ScrapPostFull>(`${API_ENDPOINTS.POSTS}/${id}`);
  },

  deleteDetail: (postId: string, categoryId: number): Promise<void> => {
    return del<void>(`${API_ENDPOINTS.POSTS}/${postId}/details/${categoryId}`);
  },
};

