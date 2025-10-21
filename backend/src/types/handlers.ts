import { DBUser } from '@shared/db/src/types';
import { Request, Response, NextFunction } from 'express';

export interface ValidatedRequest<T> extends Request {
  validated: T;
}

// Extend Express's Request type properly
export interface AuthRequest<T> extends ValidatedRequest<T> {
  user: DBUser;
}

export type ValidatedRequestHandler<T> = (
  req: ValidatedRequest<T>,
  res: Response,
  next: NextFunction
) => Promise<any>;

// RequestHandler that ensures user exists in the handler
export type AuthRequestHandler<T> = (
  req: AuthRequest<T>,
  res: Response,
  next: NextFunction
) => Promise<any>;