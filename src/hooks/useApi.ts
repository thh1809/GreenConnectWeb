import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { AxiosError } from "axios";

/**
 * Custom hook để fetch data với TanStack Query
 */
export function useApi<TData = unknown, TError = AxiosError>(
  queryKey: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">
) {
  return useQuery<TData, TError>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<TData>(endpoint);
      return response;
    },
    ...options,
  });
}

/**
 * Custom hook cho mutations
 */
export function useApiMutation<TData = unknown, TVariables = unknown, TError = AxiosError>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation<TData, TError, TVariables>({
    mutationFn,
    ...options,
  });
}

