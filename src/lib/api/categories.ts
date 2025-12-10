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
    const searchParams = new URLSearchParams();
    searchParams.append('categoryName', data.categoryName);
    // Description is required by API, always send it
    searchParams.append('description', data.description || '');
    const queryString = searchParams.toString();
    return post<ScrapCategory>(`/api/v1/scrap-categories?${queryString}`);
  },
  
  update: (id: number, data: UpdateCategoryRequest): Promise<ScrapCategory> => {
    const searchParams = new URLSearchParams();
    if (data.categoryName) {
      searchParams.append('categoryName', data.categoryName);
    }
    if (data.description) {
      searchParams.append('description', data.description);
    }
    const queryString = searchParams.toString();
    return put<ScrapCategory>(`/api/v1/scrap-categories/${id}?${queryString}`);
  },
  
  delete: (id: number): Promise<void> => {
    return del<void>(`/api/v1/scrap-categories/${id}`);
  },
};

