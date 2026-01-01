import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginInput) =>
      apiClient.post<AuthResponse>('/api/auth/login', credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success(t('loginSuccess'));
      router.push('/');
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || t('loginFailed'));
    },
  });
}

// Register mutation
export function useRegister() {
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) =>
      apiClient.post<AuthResponse>('/api/auth/register', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success(t('registerSuccess'));
      router.push('/');
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || t('registerFailed'));
    },
  });
}

// Logout mutation
export function useLogout() {
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiClient.post('/api/auth/logout'),
    onSuccess: () => {
      queryClient.clear();
      toast.success(t('logoutSuccess'));
      router.push('/login');
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.message || t('logoutFailed'));
    },
  });
}
