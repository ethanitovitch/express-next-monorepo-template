"use client";

import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Channel } from "pusher-js";
import { useSession } from "@/lib/auth-client";
import { getPusherClient, disconnectPusher, isPusherEnabled } from "@/lib/pusher-client";
import { channels, PUSHER_EVENTS, Notification } from "@shared/types/src";
import { QUERY_KEYS, ENDPOINTS } from "@/lib/config";
import { post } from "@/lib/api";
import { toast } from "sonner";

export function usePusher() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const channelRef = useRef<Channel | null>(null);

  const handleNotification = useCallback(
    (notification: Notification) => {
      // Invalidate notification queries to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationsUnreadCount() });

      // Show toast notification
      toast.success(notification.title, {
        description: notification.message,
        action: notification.link
          ? {
              label: "View",
              onClick: async () => {
                // Mark as read before navigating
                await post(ENDPOINTS.NOTIFICATIONS.MARK_READ, {
                  notificationId: notification.id,
                });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications() });
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificationsUnreadCount() });
                window.location.href = notification.link!;
              },
            }
          : undefined,
        actionButtonStyle: {
          backgroundColor: "hsl(var(--success))",
          color: "hsl(var(--success-foreground))",
        },
      });
    },
    [queryClient]
  );

  useEffect(() => {
    // Skip if Pusher is disabled
    if (!isPusherEnabled()) return;

    const userId = session?.user?.id;

    if (!userId) {
      // Not authenticated - disconnect if connected
      if (channelRef.current) {
        channelRef.current.unbind_all();
        const pusher = getPusherClient();
        if (pusher) {
          pusher.unsubscribe(channelRef.current.name);
        }
        channelRef.current = null;
      }
      disconnectPusher();
      return;
    }

    // Connect and subscribe to user's private channel
    const pusher = getPusherClient();
    if (!pusher) return;

    const channelName = channels.privateUser(userId);

    // Subscribe to private channel
    const channel = pusher.subscribe(channelName);
    channelRef.current = channel;

    // Bind to notification events
    channel.bind(PUSHER_EVENTS.NOTIFICATION, handleNotification);

    // Cleanup on unmount or user change
    return () => {
      channel.unbind(PUSHER_EVENTS.NOTIFICATION, handleNotification);
      pusher.unsubscribe(channelName);
      channelRef.current = null;
    };
  }, [session?.user?.id, handleNotification]);

  // Derive connection state from session and pusher enabled
  return { isConnected: isPusherEnabled() && !!session?.user?.id };
}
