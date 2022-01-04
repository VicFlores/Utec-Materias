import { Request, Response, NextFunction } from 'express';
import { httpException } from '../exception/httpException';

export const HandleCheckRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body;

    if (!role) {
      throw new httpException(401, 'Unauthorized');
    }

    if (roles.includes(role)) {
      next();
    } else {
      throw new httpException(401, 'Unauthorized Cond');
    }
  };
};
