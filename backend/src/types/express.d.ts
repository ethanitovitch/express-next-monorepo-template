import { DBUser } from './db'

declare global {
  namespace Express {
    interface Request {
      validated?: any
      user?: DBUser
    }
  }
}

export {}
