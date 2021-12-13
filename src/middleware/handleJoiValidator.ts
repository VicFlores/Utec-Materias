import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const handleJoiValidator = (
  schema: Joi.Schema,
  property: keyof Request
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      return res.status(400).json(error);
    }
    next();
  };
};
