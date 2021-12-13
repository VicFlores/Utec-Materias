import { Request } from 'express';

export interface iRequest extends Request {
  userID?: string;
}
