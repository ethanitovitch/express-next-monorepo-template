import { EventProcessor } from '@/queues/workers'
import { exampleQueue, scheduleRecurringExampleCheck } from '@/queues'

import logger from '@/lib/logger'

logger.info('Starting Worker services...')

export const startWorker = async () => {
  logger.info('Initializing Worker services...')
  const eventProcessor = new EventProcessor()

  try {
    const jobs = await exampleQueue.getJobSchedulers()
    for (const job of jobs) {
      logger.info(`Removing repeatable: ${job.key}`)
      await exampleQueue.removeJobScheduler(job.key)
    }
    await scheduleRecurringExampleCheck()
    logger.info('Scheduled recurring example check (every n minute)')
  } catch (error) {
    logger.error('Failed to schedule recurring stuck games check:', error)
  }

  const shutdown = async () => {
    logger.info('Shutting down Worker services...')
    await eventProcessor.close()
    logger.info('Worker services stopped.')
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  logger.info(
    'Worker is now processing events, internal tasks, and cleanup tasks...',
  )
}
