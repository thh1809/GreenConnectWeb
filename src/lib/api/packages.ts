import { get, post, patch } from './client';

export interface PaymentPackage {
  packageId: string; // UUID
  name: string;
  description: string;
  price: number;
  connectionAmount?: number; // Optional in GET list response, required in GET by ID
  isActive?: boolean; // Optional in GET list response, required in GET by ID
  packageType: 'Freemium' | 'Paid';
}

export interface PackagesResponse {
  data: PaymentPackage[];
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
    const endpoint = `/api/v1/packages${queryString ? `?${queryString}` : ''}`;
    
    return get<PackagesResponse>(endpoint);
  },

  create: (data: CreatePackageRequest): Promise<PaymentPackage> => {
    return post<PaymentPackage>('/api/v1/packages', data);
  },

  getById: (packageId: string): Promise<PaymentPackage> => {
    return get<PaymentPackage>(`/api/v1/packages/${packageId}`);
  },

  update: (packageId: string, data: UpdatePackageRequest): Promise<PaymentPackage> => {
    return patch<PaymentPackage>(`/api/v1/packages/${packageId}`, data);
  },

  inactivate: (packageId: string): Promise<string> => {
    return patch<string>(`/api/v1/packages/${packageId}/inactivate`, {});
  },
};

