import type { PaymentTransactionResponse } from "../type/payment-transaction-type";
import apiClient from "./client";

const apiEndpoint = "/api/v1/payment-transaction";
export interface GetPaymentTransactionParams {
  start?: string;
  end?: string;
  pageIndex?: number;
  pageSize?: number;
  sortByCreatedAt?: boolean;
  status?: string;
}

export const getPaymentTransactions = async (
  params: GetPaymentTransactionParams
): Promise<PaymentTransactionResponse> => {
  const query = new URLSearchParams();
  if (params.start) query.append("start", params.start);
  if (params.end) query.append("end", params.end);
  if (params.pageIndex !== undefined) query.append("pageIndex", params.pageIndex.toString());
  if (params.pageSize !== undefined) query.append("pageSize", params.pageSize.toString());
  if (params.sortByCreatedAt !== undefined) query.append("sortByCreatedAt", String(params.sortByCreatedAt));
  if (params.status) query.append("status", params.status);

  const endpoint = `${apiEndpoint}?${query.toString()}`;
  return apiClient.get<PaymentTransactionResponse>(endpoint);
};
