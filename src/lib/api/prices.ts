import { get, post, patch, del, apiRequest } from './client';

export interface ReferencePrice {
  referencePriceId: string; // UUID
  scrapCategoryId: number;
  scrapCategory: {
    scrapCategoryId: number;
    categoryName: string;
    description: string | null;
  } | null;
  pricePerKg: number;
  lastUpdated: string;
  updatedByAdminId: string;
  updatedByAdmin: {
    id: string;
    fullName: string;
    phoneNumber?: string;
    pointBalance?: number;
    rank?: string;
    roles?: string[];
    avatarUrl?: string | null;
  } | null;
}

export interface PricesResponse {
  data: ReferencePrice[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface GetPricesParams {
  pageNumber?: number;
  pageSize?: number;
  categoryName?: string;
  sortByPrice?: boolean;
  sortByUpdateAt?: boolean;
}

export interface CreatePriceRequest {
  scrapCategoryId: number;
  pricePerKg: number;
}

export interface UpdatePriceRequest {
  pricePerKg: number;
}

export const prices = {
  getAll: (params?: GetPricesParams): Promise<PricesResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.pageNumber) {
      searchParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.categoryName) {
      searchParams.append('categoryName', params.categoryName);
    }
    if (params?.sortByPrice !== undefined) {
      searchParams.append('sortByPrice', params.sortByPrice.toString());
    }
    if (params?.sortByUpdateAt !== undefined) {
      searchParams.append('sortByUpdateAt', params.sortByUpdateAt.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/prices${queryString ? `?${queryString}` : ''}`;
    
    return get<PricesResponse>(endpoint);
  },
  
  getById: (id: string): Promise<ReferencePrice> => {
    return get<ReferencePrice>(`/api/v1/prices/${id}`);
  },
  
  create: (data: CreatePriceRequest): Promise<ReferencePrice> => {
    // POST với query parameters theo Swagger (không dùng body)
    const searchParams = new URLSearchParams();
    searchParams.append('scrapCategoryId', data.scrapCategoryId.toString());
    searchParams.append('pricePerKg', data.pricePerKg.toString());
    
    const endpoint = `/api/v1/prices?${searchParams.toString()}`;
    // Gọi post với endpoint có query params, không có body
    return apiRequest<ReferencePrice>(endpoint, { method: 'POST' });
  },
  
  update: (id: string, data: UpdatePriceRequest): Promise<ReferencePrice> => {
    // PATCH với query parameters theo Swagger (không dùng body)
    const searchParams = new URLSearchParams();
    searchParams.append('pricePerKg', data.pricePerKg.toString());
    
    const endpoint = `/api/v1/prices/${id}?${searchParams.toString()}`;
    // Gọi apiRequest với method PATCH, không có body
    return apiRequest<ReferencePrice>(endpoint, { method: 'PATCH' });
  },
  
  delete: (id: string): Promise<void> => {
    return del<void>(`/api/v1/prices/${id}`);
  },
};

