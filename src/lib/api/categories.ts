import { get, post, put, del } from './client';

export interface ScrapCategory {
  scrapCategoryId: string;
  categoryName: string;
  imageUrl?: string | null;
}

type RawScrapCategory = {
  id: string;
  name: string;
  imageUrl?: string | null;
};

type RawCategoriesResponse = {
  data: RawScrapCategory[];
  pagination: {
    totalRecord?: number;
    totalRecords?: number;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
};

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
  imageUrl?: string;
  description?: string;
  stringUrl?: string;
}

export interface UpdateCategoryRequest {
  categoryName?: string;
  imageUrl?: string;
  description?: string;
  stringUrl?: string;
}

export const categories = {
  getAll: (params?: {
    pageNumber?: number;
    pageSize?: number;
    searchName?: string;
  }): Promise<CategoriesResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.pageNumber) {
      searchParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.searchName) {
      searchParams.append('searchName', params.searchName);
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/scrap-categories${queryString ? `?${queryString}` : ''}`;

    return get<RawCategoriesResponse>(endpoint).then((raw) => ({
      data: (raw?.data ?? []).map((c) => ({
        scrapCategoryId: String(c.id),
        categoryName: String(c.name ?? ''),
        imageUrl: c.imageUrl ?? null,
      })),
      pagination: {
        totalRecords: Number(raw?.pagination?.totalRecords ?? raw?.pagination?.totalRecord ?? 0),
        currentPage: Number(raw?.pagination?.currentPage ?? 1),
        totalPages: Number(raw?.pagination?.totalPages ?? 1),
        nextPage: raw?.pagination?.nextPage ?? null,
        prevPage: raw?.pagination?.prevPage ?? null,
      },
    }));
  },
  
  getById: (id: string): Promise<ScrapCategory> => {
    return get<RawScrapCategory>(`/api/v1/scrap-categories/${id}`).then((c) => ({
      scrapCategoryId: String(c.id),
      categoryName: String(c.name ?? ''),
      imageUrl: c.imageUrl ?? null,
    }));
  },
  
  create: (data: CreateCategoryRequest): Promise<ScrapCategory> => {
    const searchParams = new URLSearchParams();
    searchParams.append('categoryName', data.categoryName);
    const effectiveUrl = data.stringUrl ?? data.imageUrl;
    const effectiveDescription = data.description ?? data.imageUrl;
    if (effectiveUrl !== undefined) {
      searchParams.append('stringUrl', effectiveUrl);
    }
    if (effectiveDescription !== undefined) {
      searchParams.append('description', effectiveDescription);
    }
    if (data.imageUrl !== undefined) {
      searchParams.append('imageUrl', data.imageUrl);
    }
    const queryString = searchParams.toString();
    return post<RawScrapCategory>(`/api/v1/scrap-categories?${queryString}`).then((c) => ({
      scrapCategoryId: String(c.id),
      categoryName: String(c.name ?? ''),
      imageUrl: c.imageUrl ?? null,
    }));
  },
  
  update: (id: string, data: UpdateCategoryRequest): Promise<ScrapCategory> => {
    const searchParams = new URLSearchParams();
    if (data.categoryName) {
      searchParams.append('categoryName', data.categoryName);
    }
    const effectiveUrl = data.stringUrl ?? data.imageUrl;
    const effectiveDescription = data.description ?? data.imageUrl;
    if (effectiveUrl !== undefined) {
      searchParams.append('stringUrl', effectiveUrl);
    }
    if (effectiveDescription !== undefined) {
      searchParams.append('description', effectiveDescription);
    }
    if (data.imageUrl !== undefined) {
      searchParams.append('imageUrl', data.imageUrl);
    }
    const queryString = searchParams.toString();
    return put<RawScrapCategory>(`/api/v1/scrap-categories/${id}?${queryString}`).then((c) => ({
      scrapCategoryId: String(c.id),
      categoryName: String(c.name ?? ''),
      imageUrl: c.imageUrl ?? null,
    }));
  },
  
  delete: (id: string): Promise<void> => {
    return del<void>(`/api/v1/scrap-categories/${id}`);
  },
};

