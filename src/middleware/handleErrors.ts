import { Request, Response, NextFunction } from 'express';
import { httpException } from '../exception/httpException';

export const handleError = (
  err: httpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    return res.status(status).json({
      status,
      message,
    });
  }
};
