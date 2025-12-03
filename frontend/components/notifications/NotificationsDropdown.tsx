"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  useFlattenedNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/api/useNotifications";
import { DBNotification } from "@shared/types/src";

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadData } = useUnreadNotificationCount();
  const {
    notifications,
    unreadCount,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useFlattenedNotifications();

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: DBNotification) => {
    if (!notification.readAt) {
      markRead.mutate(notification.id);
    }
    if (notification.link) {
      setIsOpen(false);
    }
  };

  const displayCount = unreadData?.count ?? unreadCount;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 hover:bg-muted rounded-xl transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-muted-foreground" />
        {displayCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1.5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center">
            {displayCount > 99 ? "99+" : displayCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {displayCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                disabled={markAllRead.isPending}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition disabled:opacity-50"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No notifications yet
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    onMarkRead={() => {
                      if (!notification.readAt) {
                        markRead.mutate(notification.id);
                      }
                    }}
                  />
                ))}

                {/* Load More */}
                {hasNextPage && (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="w-full py-3 text-sm text-primary hover:bg-muted/50 transition disabled:opacity-50"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onClick,
  onMarkRead,
}: {
  notification: DBNotification;
  onClick: () => void;
  onMarkRead: () => void;
}) {
  const isUnread = !notification.readAt;
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });

  const content = (
    <div
      className={`
        flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition cursor-pointer
        ${isUnread ? "bg-primary/5" : ""}
      `}
      onClick={onClick}
      onMouseEnter={onMarkRead}
    >
      {/* Unread indicator */}
      <div className="pt-1.5">
        <div
          className={`w-2 h-2 rounded-full ${isUnread ? "bg-primary" : "bg-transparent"}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${isUnread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">{timeAgo}</p>
      </div>

      {/* Link indicator */}
      {notification.link && (
        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
      )}
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return content;
}

