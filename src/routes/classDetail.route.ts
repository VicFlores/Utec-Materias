import express, { NextFunction, Request, Response } from 'express';
import { ClassDetail } from '../services/classDetail.service';
import {
  createUpdateClassDetail,
  findClassDetailById,
} from '../schemas/classDetail';
import { handleJoiValidator } from '../middleware/handleJoiValidator';
import { HandleCheckRole } from '../middleware/handleAuth';

const router = express.Router();
const service = new ClassDetail();

router.get(
  '/',
  HandleCheckRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await service.classDetails();
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/specific/:id',
  HandleCheckRole('admin', 'teacher'),
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
  HandleCheckRole('admin'),
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
