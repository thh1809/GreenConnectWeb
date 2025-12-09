// hooks/useUsers.ts
import { users, type User, type UsersResponse, type GetUsersParams } from '@/lib/api/user-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Hook cho GET users (kết hợp useQuery với api.getUsers)
export function useUsers(params?: GetUsersParams) {
  return useQuery<UsersResponse>({
    queryKey: ['users', params], // Key unique cho cache, bao gồm params
    queryFn: () => users.getAll(params),
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    retry: (failureCount, error) => {
      // Không retry nếu 404 hoặc 401
      if (error.message.includes('404') || error.message.includes('401'))
        return false;
      return failureCount < 3;
    },
  });
}
export function useCreateUser() {
  const queryClient = useQueryClient(); // Để invalidate cache

  return useMutation<User, Error, Partial<User>>({
    mutationFn: users.create, // Gọi từ service API
    onSuccess: () => {
      // Invalidate và refetch 'users' query
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    // onError: error => {
    //   console.error('Lỗi tạo user:', error);
    //   // Có thể thêm toast notification ở đây
    // },
  });
}

// Export types để sử dụng ở nơi khác
export type { User, UsersResponse, GetUsersParams };
