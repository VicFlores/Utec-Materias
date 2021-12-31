import express, { Request, Response, NextFunction } from 'express';
import { HandleCheckRole } from '../middleware/handleAuth';
import { handleJoiValidator } from '../middleware/handleJoiValidator';
import {
  createUpdateSection,
  findSectionById,
} from '../schemas/section.schema';
import { Section } from '../services/section.service';

const router = express.Router();
const service = new Section();

router.get(
  '/',
  HandleCheckRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await service.findSections();
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/specific/:id',
  HandleCheckRole('admin'),
  handleJoiValidator(findSectionById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.findSectionById(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  HandleCheckRole('admin'),
  handleJoiValidator(createUpdateSection, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const response = await service.createSection(body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  HandleCheckRole('admin'),
  handleJoiValidator(createUpdateSection, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const response = await service.updateSection(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  handleJoiValidator(findSectionById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.deleteSection(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
