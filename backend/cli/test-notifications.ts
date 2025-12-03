import { createNotificationWithPush } from '@/services/notification.service'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const testNotifications = async () => {
  await delay(1000)
  const notification = await createNotificationWithPush({
    userId: 'vX7ZkVMdHv8HEHZaqiwUGDIC1knWZS1B',
    title: 'Test Notification',
    message: 'This is a test notification',
    link: 'https://www.google.com',
    readAt: null,
  })

  console.log(notification)
}

testNotifications().catch(console.error)
