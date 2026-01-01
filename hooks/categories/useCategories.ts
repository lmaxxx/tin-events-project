import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import type { CategoryInput } from '@/lib/validation/schemas';

interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get<Category[]>('/api/categories'),
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
  });
}

// Create category (admin only)
export function useCreateCategory() {
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryInput) =>
      apiClient.post<{ category: Category }>('/api/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(t('categoryCreated'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('categoryCreateFailed'));
    },
  });
}

// Update category (admin only)
export function useUpdateCategory(id: string) {
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryInput) =>
      apiClient.patch<{ category: Category }>(`/api/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(t('categoryUpdated'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('categoryUpdateFailed'));
    },
  });
}

// Delete category (admin only)
export function useDeleteCategory() {
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(t('categoryDeleted'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('categoryDeleteFailed'));
    },
  });
}
