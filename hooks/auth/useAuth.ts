import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import type { AuthResponse, UserWithRoles } from '@/lib/types/auth';
import type { LoginInput, RegisterInput } from '@/lib/validation/schemas';

// Get current user
export function useAuth() {
  return useQuery<{ user: UserWithRoles }>({
    queryKey: ['auth', 'me'],
    queryFn: () => apiClient.get('/api/auth/me'),
    retry: false,
  });
}

// Login mutation
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginInput) =>
      apiClient.post<AuthResponse>('/api/auth/login', credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Logged in successfully');
      router.push('/');
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

// Register mutation
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) =>
      apiClient.post<AuthResponse>('/api/auth/register', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Account created successfully');
      router.push('/');
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}

// Logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiClient.post('/api/auth/logout'),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Logout failed');
    },
  });
}
