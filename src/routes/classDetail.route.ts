import express, { NextFunction, Request, Response } from 'express';
import { ClassDetail } from '../services/classDetail.service';
import {
  createUpdateClassDetail,
  findClassDetailById,
} from '../schemas/classDetail';
import { handleJoiValidator } from '../middleware/handleJoiValidator';

const router = express.Router();
const service = new ClassDetail();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await service.classDetails();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/specific/:id',
  handleJoiValidator(findClassDetailById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.findClassDetailById(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  handleJoiValidator(createUpdateClassDetail, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const response = await service.createClassDetail(body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
