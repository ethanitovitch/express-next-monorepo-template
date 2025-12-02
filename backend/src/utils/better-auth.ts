import { config } from '@/config'

export const buildInvitationLink = (invitationId: string, email: string) => {
  return `${config.frontendUrl}/accept-invitation/${invitationId}?email=${encodeURIComponent(email)}`
}

export const extractSubscriptionIdFromInvoice = (invoice: any) => {
  return invoice.data.object.parent.subscription_details.subscription
}
