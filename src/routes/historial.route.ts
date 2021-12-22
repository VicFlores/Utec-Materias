import express, { Request, Response, NextFunction } from 'express';
import { handleJoiValidator } from '../middleware/handleJoiValidator';
import {
  findHistorialById,
  createUpdateHistorial,
} from '../schemas/historial.schema';
import { Historial } from '../services/historial.service';

const router = express.Router();

const service = new Historial();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await service.findHistories();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/specific/:id',
  handleJoiValidator(findHistorialById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.findHistorialById(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  handleJoiValidator(createUpdateHistorial, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const response = await service.createHistorial(body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
