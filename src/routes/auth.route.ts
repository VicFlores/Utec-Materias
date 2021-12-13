import express, { Request, Response, NextFunction } from 'express';
import { handleJoiValidator } from '../middleware/handleJoiValidator';
import { postLogin } from '../schemas/auth.schema';
import { Auth } from '../services/auth.service';

const router = express.Router();
const service = new Auth();

router.post(
  '/',
  handleJoiValidator(postLogin, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, passwd } = req.body;
      const response = await service.LoginUser(email, passwd);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);
export default router;
