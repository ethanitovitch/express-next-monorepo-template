import pino from 'pino'
import { config } from '@/config'
import { getRequestContext } from '@/lib/context'

const transport =
  config.nodeEnv === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : // logtail transport
      // : {
      //     transport: {
      //       targets: [
      //         {
      //           target: '@logtail/pino',
      //           options: {
      //             sourceToken: config.logger.betterstackToken,
      //             options: {
      //               endpoint: `https://${config.logger.betterstackHost}`,
      //               batchSize: 1,
      //               batchInterval: 1000,
      //             },
      //           },
      //           level: 'info',
      //         },
      //         {
      //           target: 'pino-pretty',
      //           options: {
      //             colorize: true,
      //             translateTime: 'SYS:standard',
      //             ignore: 'pid,hostname',
      //           },
      //           level: 'info',
      //         },
      //       ],
      //     },
      //   }
      {
        transport: {
          targets: [
            {
              target: '@axiomhq/pino',
              options: {
                dataset: config.logger.axiomDataset,
                token: config.logger.axiomToken,
              },
              level: 'info',
            },
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
              level: 'info',
            },
          ],
        },
      }

const baseLogger = pino({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  ...transport,
  base: {
    env: config.nodeEnv,
  },
})

const logger = new Proxy(baseLogger, {
  get(target: any, prop: any) {
    if (typeof target[prop] === 'function') {
      return (...args: any[]) => {
        const context = getRequestContext()
        if (context) {
          const { requestId, jobId, userId, sessionId } = context
          const contextData = { requestId, jobId, userId, sessionId }

          if (args[0] && typeof args[0] === 'object') {
            args[0] = { ...args[0], ...contextData }
          } else {
            args.unshift(contextData)
          }
        }
        return target[prop](...args)
      }
    }
    return target[prop]
  },
})

export default logger
