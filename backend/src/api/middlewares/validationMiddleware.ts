import { Request, Response, NextFunction } from 'express'
import { z, ZodError } from 'zod'
import { StatusCodes } from 'http-status-codes'

export const validateAndMerge = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const merged = {
        ...req.body,
        ...req.params,
        ...req.query,
      }

      const validated = schema.parse(merged)
      req.validated = validated
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Validation failed',
          details: error.issues,
        })
      }
      next(error)
    }
  }
}
