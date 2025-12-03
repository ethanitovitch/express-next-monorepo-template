import { z } from 'zod';

// ============================================
// Offset-based Pagination (traditional)
// ============================================

export const PaginationRequestSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const PaginatedResponseSchema = z.object({
  data: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  }),
});

export type PaginationRequest = z.infer<typeof PaginationRequestSchema>;
export type PaginatedResponse<T = any> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

// ============================================
// Cursor-based Pagination (infinite scroll)
// ============================================

export const CursorPaginationRequestSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type CursorPaginationRequest = z.infer<typeof CursorPaginationRequestSchema>;

export type CursorPaginatedResponse<T> = {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
};

// With additional metadata (e.g., unread count for notifications)
export type CursorPaginatedResponseWithMeta<T, M = Record<string, unknown>> = CursorPaginatedResponse<T> & M;

