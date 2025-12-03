import { Worker } from 'bullmq'
import { ExampleEvent, ExampleEventType, QueueName } from '@/types/queues'
import { config } from '@/config'
import { setRequestContext } from '@/lib/context'
import logger from '@/lib/logger'
import Sentry from '@/lib/sentry'

export class EventProcessor {
  private worker: Worker<ExampleEvent>

  constructor() {
    this.worker = new Worker<ExampleEvent>(
      QueueName.EXAMPLE,
      async (job) => {
        setRequestContext('jobId', job.id)
        try {
          await Sentry.withScope(async (scope) => {
            scope.setContext('job', {
              id: job.id,
              name: job.name,
              data: job.data,
            })

            logger.info(
              `Received job with id: ${job.id} and data: ${JSON.stringify(job.data)}`,
            )

            switch (job.data.type) {
              case ExampleEventType.GET_EXAMPLE:
                logger.info('Processing example event', job.data.id)
                break
              default:
                throw new Error(`Unknown event type: ${job.data.type}`)
            }
          })
        } catch (error) {
          logger.error({ error, jobId: job.id }, 'Failed to process event')
          Sentry.captureException(error, {
            extra: {
              jobId: job.id,
              jobName: job.name,
              jobData: job.data,
            },
          })
          throw error // Re-throw to let BullMQ handle the failure
        }
      },
      {
        connection: {
          url: config.redis.url,
          ...(config.redis.useTLS && {
            tls: {
              rejectUnauthorized: false,
            },
          }),
        },
      },
    )
  }

  async close() {
    await this.worker.close()
  }
}
