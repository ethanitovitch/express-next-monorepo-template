import logger from '@/lib/logger'

interface TimingData {
  operation: string
  duration: number
  metadata?: Record<string, any>
}

export class PerformanceTracker {
  private startTimes: Map<string, number> = new Map()

  start(operation: string): void {
    this.startTimes.set(operation, performance.now())
  }

  end(operation: string, metadata?: Record<string, any>): number {
    const startTime = this.startTimes.get(operation)
    if (!startTime) {
      logger.warn(`No start time found for operation: ${operation}`)
      return 0
    }

    const duration = performance.now() - startTime
    this.startTimes.delete(operation)

    const timingData: TimingData = {
      operation,
      duration,
      metadata,
    }

    // Log performance data
    logger.info(`Performance: ${operation} took ${duration}ms`, timingData)

    // Log warning for slow operations
    if (duration > 1000) {
      logger.warn(
        `Slow operation detected: ${operation} took ${duration}ms`,
        timingData,
      )
    }

    return duration
  }

  async track<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>,
  ): Promise<T> {
    this.start(operation)
    try {
      const result = await fn()
      this.end(operation, metadata)
      return result
    } catch (error) {
      this.end(operation, { ...metadata, error: true })
      throw error
    }
  }
}

export const performanceTracker = new PerformanceTracker()
