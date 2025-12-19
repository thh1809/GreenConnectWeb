import {
  CreatePriceRequest,
  GetPricesParams,
  prices,
  PricesResponse,
  ReferencePrice,
  UpdatePriceRequest,
} from '@/lib/api/prices';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function usePrices(params?: GetPricesParams) {
  return useQuery<PricesResponse, Error>({
    queryKey: ['prices', params],
    queryFn: () => prices.getAll(params),
  });
}

export function usePrice(id: string) {
  return useQuery<ReferencePrice, Error>({
    queryKey: ['price', id],
    queryFn: () => prices.getById(id),
    enabled: !!id,
  });
}

export function useCreatePrice() {
  const queryClient = useQueryClient();
  return useMutation<ReferencePrice, Error, CreatePriceRequest>({
    mutationFn: data => prices.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
    },
  });
}

export function useUpdatePrice() {
  const queryClient = useQueryClient();
  return useMutation<
    ReferencePrice,
    Error,
    { id: string; data: UpdatePriceRequest }
  >({
    mutationFn: ({ id, data }) => prices.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
    },
  });
}

export function useDeletePrice() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: id => prices.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prices'] });
    },
  });
}
