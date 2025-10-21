import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import { config } from '@/config'

Sentry.init({
  dsn: config.sentry.dsn,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
})

export default Sentry
