import express, { Request, Response, NextFunction } from 'express';
import { handleJoiValidator } from '../middleware/handleJoiValidator';
import {
  createUpdateModality,
  findModalityById,
} from '../schemas/modality.schema';
import { Modality } from '../services/modality.service';

const router = express.Router();
const service = new Modality();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await service.findModalities();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/specific/:id',
  handleJoiValidator(findModalityById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.findModalityById(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  handleJoiValidator(createUpdateModality, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const response = await service.createModality(body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  handleJoiValidator(createUpdateModality, 'body'),
  handleJoiValidator(findModalityById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const response = await service.updateModality(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  handleJoiValidator(findModalityById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.deleteModality(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;