// hooks/useUsers.ts
import { users } from '@/lib/api/user-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Type cho user (tùy chỉnh theo API response)
interface User {
  id: number;
  name: string;
  email: string;
}

// Hook cho GET users (kết hợp useQuery với api.getUsers)
export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'], // Key unique cho cache
    // queryFn: users.getAll,
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

  return useMutation({
    mutationFn: users.create, // Gọi từ service API
    onSuccess: () => {
      // Invalidate và refetch 'users' query
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    // onError: error => {

    // //   console.error('Lỗi tạo user:', error);
    //   // Có thể thêm toast notification ở đây
    // },
  });
}
