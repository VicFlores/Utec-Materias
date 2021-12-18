import express, { NextFunction, Request, response, Response } from 'express';
import { handleJoiValidator } from '../middleware/handleJoiValidator';
import {
  createUpdateTimeStamp,
  findTimeStampById,
} from '../schemas/timeStamp.schema';
import { TimeStamp } from '../services/timeStamp.service';

const router = express.Router();
const service = new TimeStamp();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await service.findTimeStamps();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/specific/:id',
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

router.post(
  '/',
  handleJoiValidator(createUpdateTimeStamp, 'body'),
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

router.put(
  '/:id',
  handleJoiValidator(findTimeStampById, 'params'),
  handleJoiValidator(createUpdateTimeStamp, 'body'),
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
