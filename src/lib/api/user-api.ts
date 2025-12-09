import { del, get, post, put, patch } from './client';

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
    const pageSize = params?.pageSize ?? 10;
    
    searchParams.append('pageIndex', pageIndex.toString());
    searchParams.append('pageSize', pageSize.toString());
    
    if (params?.roleId) {
      searchParams.append('roleId', params.roleId);
    }
    if (params?.fullName) {
      searchParams.append('fullName', params.fullName);
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v1/users?${queryString}`;
    
    return get<UsersResponse>(endpoint);
  },
  
  getById: (id: string): Promise<User> => {
    return get<User>(`/api/v1/users/${id}`);
  },
  
  create: (data: Partial<User>): Promise<User> => {
    return post<User>('/api/v1/users', data);
  },
  
  update: (id: string, data: Partial<User>): Promise<User> => {
    return put<User>(`/api/v1/users/${id}`, data);
  },
  
  delete: (id: string): Promise<void> => {
    return del<void>(`/api/v1/users/${id}`);
  },
  
  banToggle: (id: string): Promise<string> => {
    return patch<string>(`/api/v1/users/${id}/ban-toggle`);
  },
};
