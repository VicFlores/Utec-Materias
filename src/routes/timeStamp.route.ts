import express, { NextFunction, Request, response, Response } from 'express';
import { HandleCheckRole } from '../middleware/handleAuth';
import { handleJoiValidator } from '../middleware/handleJoiValidator';
import { verifyToken } from '../middleware/verifyToken';
import {
  createTimeStamp,
  findTimeStampById,
  updateTimeStamp,
} from '../schemas/timeStamp.schema';
import { TimeStamp } from '../services/timeStamp.service';

const router = express.Router();
const service = new TimeStamp();

router.get(
  '/',
  verifyToken,
  HandleCheckRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await service.findTimeStamps();
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
  handleJoiValidator(findTimeStampById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.findTimeStampById(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/mytimestamp/:id',
  verifyToken,
  HandleCheckRole('admin', 'teacher'),
  handleJoiValidator(findTimeStampById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.findTimeStampByUser(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  verifyToken,
  HandleCheckRole('admin', 'teacher'),
  handleJoiValidator(createTimeStamp, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const response = await service.createTimeStamp(body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  verifyToken,
  HandleCheckRole('admin', 'teacher'),
  handleJoiValidator(findTimeStampById, 'params'),
  handleJoiValidator(updateTimeStamp, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const response = await service.updateTimeStamp(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  handleJoiValidator(findTimeStampById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.deleteTimeStamp(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
