import {
  GetPaymentTransactionParams,
  getPaymentTransactions,
} from '@/lib/api/payment-transaction';
import type { PaymentTransactionResponse } from '@/lib/type/payment-transaction-type';
import { useQuery } from '@tanstack/react-query';

export const usePaymentTransactions = (params: GetPaymentTransactionParams) => {
  return useQuery<PaymentTransactionResponse, Error>({
    queryKey: ['payment-transactions', params],
    queryFn: () => getPaymentTransactions(params),
  });
};
