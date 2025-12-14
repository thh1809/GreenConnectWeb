import { get, post, patch } from './client';
import { API_ENDPOINTS } from '@/lib/constants';

// PaymentPackage for GET list response (without connectionAmount and isActive)
export interface PaymentPackageListItem {
  packageId: string;
  name: string;
  description: string;
  price: number;
  packageType: 'Freemium' | 'Paid';
}

// PaymentPackage for GET by ID response (with connectionAmount and isActive)
export interface PaymentPackage {
  packageId: string;
  name: string;
  description: string;
  price: number;
  connectionAmount: number;
  isActive: boolean;
  packageType: 'Freemium' | 'Paid';
}

export interface PackagesResponse {
  data: PaymentPackageListItem[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface GetPackagesParams {
  pageNumber?: number;
  pageSize?: number;
  sortByPrice?: boolean;
  packageType?: 'Freemium' | 'Paid';
  name?: string;
}

export interface CreatePackageRequest {
  name: string;
  description: string;
  price: number;
  connectionAmount: number;
  packageType: number; // 1 for Paid, 0 for Freemium (based on API)
}

export interface UpdatePackageRequest {
  name: string;
  description: string;
  price: number;
  connectionAmount: number;
  packageType: number; // 1 for Paid, 0 for Freemium (based on API)
}

export const packages = {
  getAll: (params?: GetPackagesParams): Promise<PackagesResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.pageNumber) {
      searchParams.append('pageNumber', params.pageNumber.toString());
    }
    if (params?.pageSize) {
      searchParams.append('pageSize', params.pageSize.toString());
    }
    if (params?.sortByPrice !== undefined) {
      searchParams.append('sortByPrice', params.sortByPrice.toString());
    }
    if (params?.packageType) {
      searchParams.append('packageType', params.packageType);
    }
    if (params?.name) {
      searchParams.append('name', params.name);
    }

    const queryString = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.PACKAGES}${queryString ? `?${queryString}` : ''}`;
    
    return get<PackagesResponse>(endpoint);
  },

  create: (data: CreatePackageRequest): Promise<PaymentPackage> => {
    return post<PaymentPackage>(API_ENDPOINTS.PACKAGES, data);
  },

  getById: (packageId: string): Promise<PaymentPackage> => {
    return get<PaymentPackage>(`${API_ENDPOINTS.PACKAGES}/${packageId}`);
  },

  update: (packageId: string, data: UpdatePackageRequest): Promise<PaymentPackage> => {
    return patch<PaymentPackage>(`${API_ENDPOINTS.PACKAGES}/${packageId}`, data);
  },

  inactivate: (packageId: string): Promise<string> => {
    return patch<string>(`${API_ENDPOINTS.PACKAGES}/${packageId}/inactivate`, {});
  },
};

