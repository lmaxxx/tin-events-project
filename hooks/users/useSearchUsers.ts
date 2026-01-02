import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

// Search available users for an event
export function useSearchAvailableUsers(
  eventId: string,
  searchQuery: string,
  options?: {
    enabled?: boolean;
    limit?: number;
  }
) {
  const { enabled = true, limit = 20 } = options || {};

  return useQuery({
    queryKey: ['events', eventId, 'available-users', searchQuery, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      }
      params.set('limit', limit.toString());

      const response = await apiClient.get<{ users: User[] }>(
        `/api/events/${eventId}/available-users?${params.toString()}`
      );
      return response.users;
    },
    enabled: enabled && searchQuery.length >= 0, // Always enabled, even with empty query
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous results while loading new ones
  });
}
