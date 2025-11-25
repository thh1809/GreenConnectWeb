import { get, post, put, del } from './client';

export interface ScrapCategory {
  scrapCategoryId: number;
  categoryName: string;
  description: string | null;
}

export interface CategoriesResponse {
  data: ScrapCategory[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface CreateCategoryRequest {
  categoryName: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  categoryName?: string;
  description?: string;
}

export const categories = {
  getAll: (params?: {
    pageNumber?: number;
    pageSize?: number;
  }): Promise<CategoriesResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.pageNumber) {
      searchParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/scrap-categories${queryString ? `?${queryString}` : ''}`;
    
    return get<CategoriesResponse>(endpoint);
  },
  
  getById: (id: number): Promise<ScrapCategory> => {
    return get<ScrapCategory>(`/api/v1/scrap-categories/${id}`);
  },
  
  create: (data: CreateCategoryRequest): Promise<ScrapCategory> => {
    return post<ScrapCategory>('/api/v1/scrap-categories', data);
  },
  
  update: (id: number, data: UpdateCategoryRequest): Promise<ScrapCategory> => {
    return put<ScrapCategory>(`/api/v1/scrap-categories/${id}`, data);
  },
  
  delete: (id: number): Promise<void> => {
    return del<void>(`/api/v1/scrap-categories/${id}`);
  },
};



