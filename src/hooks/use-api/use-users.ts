import { users, type User, type UsersResponse, type GetUsersParams } from '@/lib/api/user-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CACHE_TIME } from '@/lib/constants';

/**
 * Hook để lấy danh sách users với pagination và filtering
 * @param params - Tham số tìm kiếm và phân trang
 * @returns Query result với data, loading, error states
 */
export function useUsers(params?: GetUsersParams) {
  return useQuery<UsersResponse>({
    queryKey: ['users', params],
    queryFn: () => users.getAll(params),
    staleTime: CACHE_TIME.MEDIUM,
    retry: (failureCount, error) => {
      if (error.message.includes('404') || error.message.includes('401')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook để tạo user mới
 * @returns Mutation object với mutate function và states
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, Partial<User>>({
    mutationFn: users.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export type { User, UsersResponse, GetUsersParams };

