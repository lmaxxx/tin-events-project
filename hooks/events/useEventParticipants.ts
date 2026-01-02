import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';

// Remove participant from event
export function useRemoveParticipant(eventId: string) {
  const t = useTranslations('events.detail.participants');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      apiClient.delete(`/api/events/${eventId}/participants/${userId}`),
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['events', eventId] });

      // Snapshot previous value
      const previousEvent = queryClient.getQueryData(['events', eventId]);

      // Optimistically update event
      queryClient.setQueryData(['events', eventId], (old: any) => {
        if (!old?.event) return old;

        return {
          ...old,
          event: {
            ...old.event,
            visitorCount: Math.max(0, old.event.visitorCount - 1),
            visitors: (old.event.visitors || []).filter(
              (v: any) => v.id !== userId
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
      toast.error(error.message || t('removeFailed'));
    },
    onSuccess: () => {
      toast.success(t('removeSuccess'));
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
    },
  });
}

// Add participant to event
export function useAddParticipant(eventId: string) {
  const t = useTranslations('events.detail.participants');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      apiClient.post(`/api/events/${eventId}/participants`, { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', eventId] });
      toast.success(t('addSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('addFailed'));
    },
  });
}
