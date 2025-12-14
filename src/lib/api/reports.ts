import { get } from './client';
import { API_ENDPOINTS } from '@/lib/constants';

export interface TransactionStatus {
  transactionStatus: string;
  totalTransactionStatus: number;
}

export interface ReportResponse {
  totalRewardItems: number;
  activityComplaint: number;
  totalPost: number;
  totalAllUsers: number;
  totalTransaction: number;
  transactionStatus: TransactionStatus[];
}

export interface GetReportsParams {
  start?: string; // ISO date-time string
  end?: string; // ISO date-time string
}

export const reports = {
  getReport: (params?: GetReportsParams): Promise<ReportResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params?.start) {
      searchParams.append('start', params.start);
    }
    if (params?.end) {
      searchParams.append('end', params.end);
    }

    const queryString = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.REPORTS}${queryString ? `?${queryString}` : ''}`;
    
    return get<ReportResponse>(endpoint);
  },
};

