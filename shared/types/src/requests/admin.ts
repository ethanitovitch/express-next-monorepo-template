import { z } from 'zod';
import { PaginationRequestSchema, PaginatedResponse } from './pagination';

// Admin Users
export const AdminUsersRequestSchema = PaginationRequestSchema.extend({
  search: z.string().optional(),
});

export type AdminUsersRequest = z.infer<typeof AdminUsersRequestSchema>;

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  role: string | null;
  emailVerified: boolean;
  organizations: string[]; // org names for search display
};

export type AdminUsersResponse = PaginatedResponse<AdminUser>;

// Admin Organizations
export const AdminOrganizationsRequestSchema = PaginationRequestSchema.extend({
  search: z.string().optional(),
});

export type AdminOrganizationsRequest = z.infer<typeof AdminOrganizationsRequestSchema>;

export type AdminOrganization = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  memberCount: number;
  creditBalance: number;
};

export type AdminOrganizationsResponse = PaginatedResponse<AdminOrganization>;

// Stats
export type AdminStats = {
  users: number;
  organizations: number;
};

// Add Credits
export const AddOrganizationCreditsRequestSchema = z.object({
  organizationId: z.string(),
  amount: z.number().int().min(1),
  reason: z.string().optional(),
});

export type AddOrganizationCreditsRequest = z.infer<typeof AddOrganizationCreditsRequestSchema>;

