import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { apiClient } from '@/lib/api/client';
import type { CreateEventInput, UpdateEventInput } from '@/lib/validation/schemas';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string | null;
  capacity: number;
  location: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
    description: string | null;
  };
  visitorCount: number;
  visitors?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

interface EventsFilters {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  search?: string;
  date?: Date;
}

interface EventsResponse {
  data: Event[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Get paginated events list
export function useEvents(filters?: EventsFilters) {
  const params = new URLSearchParams();
  if (filters?.page) params.set('page', filters.page.toString());
  if (filters?.pageSize) params.set('pageSize', filters.pageSize.toString());
  if (filters?.categoryId) params.set('categoryId', filters.categoryId);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.date) params.set('date', format(filters.date, 'yyyy-MM-dd'));

  return useQuery<EventsResponse>({
    queryKey: ['events', filters],
    queryFn: async () => {
      const response = await fetch(`/api/events?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch events');
      }
      return response.json();
    },
    staleTime: 30000,
  });
}

// Get single event
export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => apiClient.get<{ event: Event }>(`/api/events/${id}`),
    enabled: !!id,
  });
}

// Create event
export function useCreateEvent() {
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateEventInput) =>
      apiClient.post<{ event: Event }>('/api/events', data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(t('eventCreated'));
      router.push(`/events/${response.event.id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || t('eventCreateFailed'));
    },
  });
}

// Update event
export function useUpdateEvent(id: string) {
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: UpdateEventInput) =>
      apiClient.patch<{ event: Event }>(`/api/events/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', id] });
      toast.success(t('eventUpdated'));
      router.push(`/events/${id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || t('eventUpdateFailed'));
    },
  });
}

// Delete event
export function useDeleteEvent() {
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(t('eventDeleted'));
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.message || t('eventDeleteFailed'));
    },
  });
}

// Register for event
export function useRegisterForEvent(eventId: string) {
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post(`/api/events/${eventId}/register`),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['events', eventId] });

      // Snapshot previous value
      const previousEvent = queryClient.getQueryData(['events', eventId]);

      // Get current user
      const authData = queryClient.getQueryData(['auth', 'me']) as { user: any } | undefined;

      // Optimistically update event
      queryClient.setQueryData(['events', eventId], (old: any) => {
        if (!old?.event || !authData?.user) return old;

        return {
          ...old,
          event: {
            ...old.event,
            visitorCount: old.event.visitorCount + 1,
            visitors: [
              ...(old.event.visitors || []),
              {
                id: authData.user.id,
                name: authData.user.name,
                email: authData.user.email,
              },
            ],
          },
        };
      });

      return { previousEvent };
    },
    onError: (error: any, _variables, context) => {
      // Rollback to previous value
      if (context?.previousEvent) {
        queryClient.setQueryData(['events', eventId], context.previousEvent);
      }
      toast.error(error.message || t('eventRegisterFailed'));
    },
    onSuccess: () => {
      toast.success(t('eventRegistered'));
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
    },
  });
}

// Unregister from event
export function useUnregisterFromEvent(eventId: string) {
  const t = useTranslations('errors.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.delete(`/api/events/${eventId}/unregister`),
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['events', eventId] });

      // Snapshot previous value
      const previousEvent = queryClient.getQueryData(['events', eventId]);

      // Get current user
      const authData = queryClient.getQueryData(['auth', 'me']) as { user: any } | undefined;

      // Optimistically update event
      queryClient.setQueryData(['events', eventId], (old: any) => {
        if (!old?.event || !authData?.user) return old;

        return {
          ...old,
          event: {
            ...old.event,
            visitorCount: Math.max(0, old.event.visitorCount - 1),
            visitors: (old.event.visitors || []).filter(
              (v: any) => v.id !== authData.user.id
            ),
          },
        };
      });

      return { previousEvent };
    },
    onError: (error: any, _variables, context) => {
      // Rollback to previous value
      if (context?.previousEvent) {
        queryClient.setQueryData(['events', eventId], context.previousEvent);
      }
      toast.error(error.message || t('eventUnregisterFailed'));
    },
    onSuccess: () => {
      toast.success(t('eventUnregistered'));
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
    },
  });
}

// Get user's created events
export function useMyEvents(filters?: { search?: string; date?: Date; categoryId?: string }) {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.date) params.set('date', format(filters.date, 'yyyy-MM-dd'));
  if (filters?.categoryId) params.set('categoryId', filters.categoryId);

  return useQuery({
    queryKey: ['my-events', filters],
    queryFn: () => apiClient.get<{ events: Event[] }>(`/api/my/events?${params.toString()}`),
    staleTime: 30000,
  });
}

// Get user's event registrations
export function useMyRegistrations(filters?: { search?: string; date?: Date; categoryId?: string }) {
  const params = new URLSearchParams();
  if (filters?.search) params.set('search', filters.search);
  if (filters?.date) params.set('date', format(filters.date, 'yyyy-MM-dd'));
  if (filters?.categoryId) params.set('categoryId', filters.categoryId);

  return useQuery({
    queryKey: ['my-registrations', filters],
    queryFn: () => apiClient.get<{ events: Event[] }>(`/api/my/registrations?${params.toString()}`),
    staleTime: 30000,
  });
}
