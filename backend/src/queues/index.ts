import { Queue } from 'bullmq'
import { ExampleEvent, ExampleEventType, QueueName } from '@/types/queues'
import { config } from '@/config'

export const exampleQueue = new Queue<ExampleEvent>(QueueName.EXAMPLE, {
  connection: {
    url: config.redis.url,
    ...(config.redis.useTLS && {
      tls: {
        rejectUnauthorized: false,
      },
    }),
  },
})

export const addExampleEvent = async (
  event: ExampleEvent,
  attempts: number = 3,
  backoff: number = 1000,
) => {
  await exampleQueue.add(event.type, event, {
    attempts,
    backoff: {
      type: 'exponential',
      delay: backoff,
    },
  })
}

export const scheduleRecurringExampleCheck = async () => {
  await exampleQueue.add(
    ExampleEventType.GET_EXAMPLE,
    {
      id: 'example',
      type: ExampleEventType.GET_EXAMPLE,
    },
    {
      repeat: {
        every: 5000,
      },
      jobId: 'example-check', // Ensure only one recurring job
      removeOnComplete: 10, // Keep last 10 completed jobs
      removeOnFail: 5, // Keep last 5 failed jobs
    },
  )
}
