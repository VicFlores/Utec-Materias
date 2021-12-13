import express, { Request, Response, NextFunction, request } from 'express';
import { handleJoiValidator } from '../middleware/handleJoiValidator';
import {
  findSubjectById,
  createUpdateSubject,
} from '../schemas/subject.schema';
import { Subject } from '../services/subject.service';

const router = express.Router();
const service = new Subject();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await service.findSubjects();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/specific/:id',
  handleJoiValidator(findSubjectById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.findSubjectById(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  handleJoiValidator(createUpdateSubject, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const response = await service.createSubject(body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/specific/:id',
  handleJoiValidator(createUpdateSubject, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const response = await service.updateSubject(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  handleJoiValidator(findSubjectById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.deleteSubject(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
