import { get, del } from './client';

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
  scrapCategoryId: string;
  categoryName: string;
  description: string | null;
}

export interface ScrapPostDetail {
  scrapCategoryId: string;
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

const normalizeRank = (rank: unknown): string => {
  if (rank === null || rank === undefined) return '';

  const raw =
    typeof rank === 'string'
      ? rank
      : typeof rank === 'number'
        ? String(rank)
        : typeof rank === 'object'
          ? String(
              (rank as any).name ??
                (rank as any).rank ??
                (rank as any).value ??
                (rank as any).code ??
                ''
            )
          : '';

  const normalized = raw.trim();
  if (!normalized) return '';

  const lastSegment = normalized.includes('.') ? normalized.split('.').pop() || normalized : normalized;
  const seg = lastSegment.trim();
  if (!seg || seg.toLowerCase() === 'rank') return '';

  // Some backends serialize enums as numeric values
  if (/^\d+$/.test(seg)) {
    const n = Number(seg);
    switch (n) {
      case 0:
        return 'Bronze';
      case 1:
        return 'Silver';
      case 2:
        return 'Gold';
      case 3:
        return 'Platinum';
      case 4:
        return 'Diamond';
      default:
        return '';
    }
  }

  return seg;
};

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
    const endpoint = `/api/v1/posts${queryString ? `?${queryString}` : ''}`;

    return get<any>(endpoint).then((raw) => ({
      data: (raw?.data ?? []).map((p: any) => ({
        scrapPostId: String(p?.id ?? p?.scrapPostId ?? ''),
        householdId: String(p?.householdId ?? ''),
        household: p?.household
          ? {
              ...p.household,
              rank: normalizeRank(p.household?.rank),
            }
          : p?.household,
        title: String(p?.title ?? ''),
        description: String(p?.description ?? ''),
        availableTimeRange: String(p?.availableTimeRange ?? ''),
        createdAt: String(p?.createdAt ?? ''),
        updatedAt: String(p?.updatedAt ?? ''),
        status: p?.status,
      })),
      pagination: raw?.pagination,
    }));
  },

  getById: (id: string): Promise<ScrapPostFull> => {
    return get<any>(`/api/v1/posts/${id}`).then((p) => ({
      scrapPostId: String(p?.id ?? p?.scrapPostId ?? ''),
      title: String(p?.title ?? ''),
      description: String(p?.description ?? ''),
      address: String(p?.address ?? ''),
      availableTimeRange: String(p?.availableTimeRange ?? ''),
      status: p?.status,
      createdAt: String(p?.createdAt ?? ''),
      updatedAt: String(p?.updatedAt ?? ''),
      householdId: String(p?.householdId ?? ''),
      household: p?.household
        ? {
            ...p.household,
            rank: normalizeRank(p.household?.rank),
          }
        : p?.household,
      mustTakeAll: Boolean(p?.mustTakeAll),
      scrapPostDetails: (p?.scrapPostDetails ?? []).map((d: any) => ({
        scrapCategoryId: d?.scrapCategoryId,
        scrapCategory: d?.scrapCategory,
        amountDescription: String(d?.amountDescription ?? ''),
        imageUrl: d?.imageUrl ?? null,
        status: d?.status,
      })),
    }));
  },

  deleteDetail: (postId: string, categoryId: string): Promise<void> => {
    return del<void>(`/api/v1/posts/${postId}/details/${categoryId}`);
  },
};

