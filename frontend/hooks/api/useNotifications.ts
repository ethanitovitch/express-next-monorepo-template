import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post } from '@/lib/api';
import { QUERY_KEYS, ENDPOINTS } from '@/lib/config';
import {
  NotificationsResponse,
  UnreadCountResponse,
  DBNotification,
} from '@shared/types/src';

/**
 * Infinite scroll hook for notifications
 */
export function useNotifications(options?: { unreadOnly?: boolean }) {
  return useInfiniteQuery<NotificationsResponse>({
    queryKey: [...QUERY_KEYS.notifications(), options?.unreadOnly],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set('cursor', pageParam as string);
      if (options?.unreadOnly) params.set('unreadOnly', 'true');
      params.set('limit', '20');
      
      const url = `${ENDPOINTS.NOTIFICATIONS.LIST}?${params.toString()}`;
      return await get<NotificationsResponse>(url);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}

/**
 * Get unread notification count
 */
export function useUnreadNotificationCount() {
  return useQuery<UnreadCountResponse>({
    queryKey: QUERY_KEYS.notificationsUnreadCount(),
    queryFn: async () => {
      return await get<UnreadCountResponse>(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Mark a single notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation<DBNotification, Error, string>({
    mutationFn: async (notificationId: string) => {
      return await post<DBNotification>(ENDPOINTS.NOTIFICATIONS.MARK_READ, {
        notificationId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationsUnreadCount() });
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error>({
    mutationFn: async () => {
      return await post<{ success: boolean }>(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationsUnreadCount() });
    },
  });
}

/**
 * Helper to flatten paginated notifications
 */
export function useFlattenedNotifications(options?: { unreadOnly?: boolean }) {
  const query = useNotifications(options);
  
  const notifications = query.data?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = query.data?.pages[0]?.unreadCount ?? 0;

  return {
    ...query,
    notifications,
    unreadCount,
  };
}
