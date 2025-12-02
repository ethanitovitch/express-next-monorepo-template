import { extractSubscriptionIdFromInvoice } from '@/utils/better-auth'
import {
  createCreditTransaction,
  getSubscriptionFromStripeSubscriptionId,
} from '@/repositories/subscription.repository'

export const handleInvoicePaid = async (invoice: any) => {
  const subscriptionId = extractSubscriptionIdFromInvoice(invoice)
  if (!subscriptionId) {
    throw new Error('Subscription ID not found in invoice')
  }
  const subscription =
    await getSubscriptionFromStripeSubscriptionId(subscriptionId)
  if (!subscription) {
    throw new Error('Subscription not found')
  }

  await createCreditTransaction(
    subscription.referenceId,
    invoice.id,
    1,
    invoice.data.object,
  )
}
