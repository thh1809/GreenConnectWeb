import { get, post, put, del } from './client';

const toPublicImageUrl = (value?: string | null): string | null => {
  if (!value) return null;
  const v = String(value).trim();
  if (!v) return null;
  const fallbackBucket =
    process.env.NEXT_PUBLIC_GCS_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_STORAGE_BUCKET ||
    'greenconnect-dev.appspot.com';
  if (v.startsWith('http://') || v.startsWith('https://')) {
    try {
      const u = new URL(v);
      if (u.hostname === 'storage.googleapis.com') {
        const parts = u.pathname.split('/').filter(Boolean);
        // If URL is missing bucket (only 1 path segment), inject fallback bucket
        if (parts.length === 1) {
          return `https://storage.googleapis.com/${fallbackBucket}/${parts[0]}`;
        }
      }
    } catch {
      // ignore
    }
    return v;
  }
  if (/^[^/]+\/.+$/.test(v)) {
    const parts = v.split('/');
    const first = parts[0];
    const rest = parts.slice(1).join('/');
    if (first === 'storage.googleapis.com') {
      return `https://${v}`;
    }
    // If first segment looks like a bucket/domain (contains '.'), treat as bucket/object
    if (first.includes('.')) {
      return `https://storage.googleapis.com/${first}/${rest}`;
    }
    // Otherwise treat the whole string as object key under fallback bucket
    return `https://storage.googleapis.com/${fallbackBucket}/${v.replace(/^\/+/, '')}`;
  }
  return `https://storage.googleapis.com/${fallbackBucket}/${v.replace(/^\/+/, '')}`;
};

export interface ScrapCategory {
  scrapCategoryId: string;
  categoryName: string;
  imageUrl?: string | null;
  imagePath?: string | null;
}

type RawScrapCategory = {
  id: string;
  name: string;
  imageUrl?: string | null;
  filePath?: string | null;
  stringUrl?: string | null;
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
        imagePath: (c.imageUrl ?? c.filePath ?? c.stringUrl ?? null),
        scrapCategoryId: String(c.id),
        categoryName: String(c.name ?? ''),
        imageUrl: toPublicImageUrl(c.imageUrl ?? c.filePath ?? c.stringUrl ?? null),
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
      imagePath: (c.imageUrl ?? c.filePath ?? c.stringUrl ?? null),
      imageUrl: toPublicImageUrl(c.imageUrl ?? c.filePath ?? c.stringUrl ?? null),
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
      imagePath: (c.imageUrl ?? c.filePath ?? c.stringUrl ?? null),
      imageUrl: toPublicImageUrl(c.imageUrl ?? c.filePath ?? c.stringUrl ?? null),
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
      imagePath: (c.imageUrl ?? c.filePath ?? c.stringUrl ?? null),
      imageUrl: toPublicImageUrl(c.imageUrl ?? c.filePath ?? c.stringUrl ?? null),
    }));
  },
  
  delete: (id: string): Promise<void> => {
    return del<void>(`/api/v1/scrap-categories/${id}`);
  },
};

