declare global {
  namespace Express {
    interface Request {
      validated?: any
    }
  }
}

export {}
