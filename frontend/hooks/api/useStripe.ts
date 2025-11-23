import { useMutation, useQuery } from "@tanstack/react-query";
import { subscription } from "@/lib/auth-client";

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async ({ 
      planName, 
      organizationId 
    }: { 
      planName: string; 
      organizationId: string;
    }) => {
      return await subscription.upgrade({
        plan: planName,
        referenceId: organizationId,
        successUrl: `${window.location.origin}/dashboard/settings?success=true`,
        cancelUrl: `${window.location.origin}/dashboard/settings?canceled=true`
      });
    },
  });
};

export const useOrganizationSubscription = (organizationId?: string) => {
  return useQuery({
    queryKey: ["organization-subscription", organizationId],
    queryFn: async () => {
      if (!organizationId) return null;
      const subscriptions = await subscription.list({
        query: {
          referenceId: organizationId,
        },
      });
      return subscriptions.data?.[0] || null;
    },
    enabled: !!organizationId,
  });
};

export const useCreatePortalSession = () => {
  return useMutation({
    mutationFn: async ({ organizationId }: { organizationId: string }) => {
      return await subscription.billingPortal({
        referenceId: organizationId,
        returnUrl: `${window.location.origin}/dashboard/settings`,
      });
    },
  });
};

