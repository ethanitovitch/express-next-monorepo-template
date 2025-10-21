import { AsyncLocalStorage } from 'async_hooks'

interface RequestContext {
  requestId: string
  jobId: string
  userId?: string
  sessionId?: string
}

export const asyncLocalStorage = new AsyncLocalStorage<RequestContext>()

export const setRequestContext = (key: string, value: any) => {
  let currentContext = asyncLocalStorage.getStore()
  if (currentContext) {
    currentContext[key as keyof RequestContext] = value
  } else {
    currentContext = {
      requestId: '',
      jobId: '',
    }
    currentContext[key as keyof RequestContext] = value
  }
  asyncLocalStorage.enterWith(currentContext)
}

export const getRequestContext = (): RequestContext | undefined => {
  return asyncLocalStorage.getStore()
}
