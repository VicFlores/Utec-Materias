import express, { Request, Response, NextFunction } from 'express';
import { HandleCheckRole } from '../middleware/handleAuth';
import { handleJoiValidator } from '../middleware/handleJoiValidator';
import { verifyToken } from '../middleware/verifyToken';
import {
  createUser,
  findUserById,
  updateEspecialUser,
  updateUser,
} from '../schemas/user.schema';
import { User } from '../services/user.service';

const router = express.Router();
const service = new User();

router.get(
  '/',
  HandleCheckRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await service.findUsers();
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/specific/:id',
  verifyToken,
  HandleCheckRole('admin', 'teacher'),
  handleJoiValidator(findUserById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.findUserById(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  HandleCheckRole('admin'),
  handleJoiValidator(createUser, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const response = await service.createUser(body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  HandleCheckRole('admin', 'teacher'),
  handleJoiValidator(updateUser, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const response = await service.updateUser(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/special/:id',
  HandleCheckRole('admin'),
  handleJoiValidator(updateEspecialUser, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const response = await service.updateSpecialUser(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  HandleCheckRole('admin'),
  handleJoiValidator(findUserById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.deleteUser(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
