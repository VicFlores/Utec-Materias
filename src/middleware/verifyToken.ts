import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { httpException } from '../exception/httpException';
import { IPayload } from '../interfaces/IPayload';
import { iRequest } from '../interfaces/iRequest';

export const verifyToken = (
  req: iRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('token');

  if (!token) throw new httpException(401, 'Access denied');

  const payload = jwt.verify(token, process.env.TOKEN_SECRET || '') as IPayload;

  req.userID = payload.id;

  next();
};
