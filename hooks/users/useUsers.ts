import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
}

interface UpdateUserRolesInput {
  roles: string[];
}

// Get paginated users list (admin only)
export function useUsers(page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () =>
      apiClient.get<{
        users: User[];
        pagination: {
          page: number;
          pageSize: number;
          total: number;
          totalPages: number;
        };
      }>(`/api/users?page=${page}&pageSize=${pageSize}`),
  });
}

// Get single user (admin only)
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => apiClient.get<{ user: User }>(`/api/users/${id}`),
    enabled: !!id,
  });
}

// Update user details (admin only)
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserInput) =>
      apiClient.patch<{ user: User }>(`/api/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
}

// Update user roles (admin only)
export function useUpdateUserRoles(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRolesInput) =>
      apiClient.patch<{ user: User }>(`/api/users/${id}/roles`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User roles updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user roles');
    },
  });
}

// Delete user (admin only)
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
}
