import { del, get, post, put, patch } from './client';
import { API_ENDPOINTS, PAGINATION } from '@/lib/constants';

export interface User {
  id: string; // UUID
  fullName: string;
  phoneNumber: string;
  pointBalance: number;
  rank: string;
  roles: string[];
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface UsersResponse {
  data: User[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface GetUsersParams {
  pageIndex?: number;
  pageSize?: number;
  roleId?: string; // UUID
  fullName?: string;
}

export const users = {
  getAll: (params?: GetUsersParams): Promise<UsersResponse> => {
    const searchParams = new URLSearchParams();
    
    // Set default values nếu không có params
    const pageIndex = params?.pageIndex ?? 1;
    const pageSize = params?.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE;
    
    searchParams.append('pageIndex', pageIndex.toString());
    searchParams.append('pageSize', pageSize.toString());
    
    if (params?.roleId) {
      searchParams.append('roleId', params.roleId);
    }
    if (params?.fullName) {
      searchParams.append('fullName', params.fullName);
    }

    const queryString = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.USERS}?${queryString}`;
    
    return get<UsersResponse>(endpoint);
  },
  
  getById: (id: string): Promise<User> => {
    return get<User>(`${API_ENDPOINTS.USERS}/${id}`);
  },
  
  create: (data: Partial<User>): Promise<User> => {
    return post<User>(API_ENDPOINTS.USERS, data);
  },
  
  update: (id: string, data: Partial<User>): Promise<User> => {
    return put<User>(`${API_ENDPOINTS.USERS}/${id}`, data);
  },
  
  delete: (id: string): Promise<void> => {
    return del<void>(`${API_ENDPOINTS.USERS}/${id}`);
  },
  
  banToggle: (id: string): Promise<string> => {
    return patch<string>(`${API_ENDPOINTS.USERS}/${id}/ban-toggle`);
  },
};
