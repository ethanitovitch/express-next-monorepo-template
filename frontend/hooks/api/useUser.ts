import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';
import { QUERY_KEYS, ENDPOINTS } from '@/lib/config';
import { AccountResponse } from '@shared/types/src';

/**
 * Get the current user's account information
 * Includes authentication provider details
 */
export function useUserAccount() {
  return useQuery<AccountResponse>({
    queryKey: QUERY_KEYS.userAccount(),
    queryFn: async () => {
      return await get<AccountResponse>(ENDPOINTS.USER.ACCOUNT);
    }
  });
}

/**
 * Helper hook to check if user has password authentication
 * Returns true if user signed up with email/password
 */
export function useHasPasswordAuth() {
  const { data: account } = useUserAccount();
  return account?.providerId === 'credential';
}

