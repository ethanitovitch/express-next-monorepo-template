import { z } from "zod";

const envSchema = z.object({
  API_URL: z.url().default('http://localhost:8000/api'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Pusher
  PUSHER_ENABLED: z.string().default('false').transform((val) => val === 'true'),
  PUSHER_KEY: z.string().default('app-key'),
  PUSHER_HOST: z.string().default('localhost'),
  PUSHER_PORT: z.coerce.number().default(6001),
  PUSHER_USE_TLS: z.string().default('false').transform((val) => val === 'true'),
  // PostHog
  POSTHOG_ENABLED: z.string().default('false').transform((val) => val === 'true'),
});

export const env = envSchema.parse({
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
  PUSHER_ENABLED: process.env.NEXT_PUBLIC_PUSHER_ENABLED,
  PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
  PUSHER_HOST: process.env.NEXT_PUBLIC_PUSHER_HOST,
  PUSHER_PORT: process.env.NEXT_PUBLIC_PUSHER_PORT,
  PUSHER_USE_TLS: process.env.NEXT_PUBLIC_PUSHER_USE_TLS,
  POSTHOG_ENABLED: process.env.NEXT_PUBLIC_POSTHOG_ENABLED,
});

export const ENDPOINTS = {
  USER: {
    ACCOUNT: '/user/account',
  },
  AUTH: {
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
    FORGOT_PASSWORD: '/auth/forget-password',
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    SIGN_OUT: '/auth/sign-out',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  ORGANIZATION: {
    INVITE_MEMBER: '/auth/organization/invite-member',
    CREDIT_BALANCE: (orgId: string) => `/organization/${orgId}/credit-balance`,
  },
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    ORGANIZATIONS: '/admin/organizations',
    ADD_CREDITS: (organizationId: string) => `/admin/organizations/${organizationId}/credits`,
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    UNREAD_COUNT: '/notifications/unread-count',
    MARK_READ: '/notifications/mark-read',
    MARK_ALL_READ: '/notifications/mark-all-read',
  },
};

export const QUERY_KEYS = {
  organizations: () => ['organizations'] as const,
  userAccount: () => ['user', 'account'] as const,
  organizationMembers: (orgId?: string) => ['organization', 'members', orgId] as const,
  organizationInvitations: (orgId?: string) => ['organization', 'invitations', orgId] as const,
  organizationCreditBalance: (orgId?: string) => ['organization', 'credit-balance', orgId] as const,
  adminStats: () => ['admin', 'stats'] as const,
  adminUsers: () => ['admin', 'users'] as const,
  adminOrganizations: () => ['admin', 'organizations'] as const,
  adminAddCredits: (organizationId?: string) => ['admin', 'organizations', organizationId, 'credits'] as const,
  notifications: () => ['notifications'] as const,
  notificationsUnreadCount: () => ['notifications', 'unread-count'] as const,
};