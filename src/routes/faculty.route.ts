import express, { NextFunction, Request, response, Response } from 'express';
import { HandleCheckRole } from '../middleware/handleAuth';
import { handleJoiValidator } from '../middleware/handleJoiValidator';
import { verifyToken } from '../middleware/verifyToken';
import {
  findFacultyById,
  createUpdateFaculty,
} from '../schemas/faculty.schema';
import { Faculty } from '../services/faculty.service';

const router = express.Router();

const service = new Faculty();

router.get(
  '/',
  verifyToken,
  HandleCheckRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await service.findFaculties();
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/specific/:id',
  verifyToken,
  HandleCheckRole('admin'),
  handleJoiValidator(findFacultyById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.findFacultyById(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  verifyToken,
  HandleCheckRole('admin'),
  handleJoiValidator(createUpdateFaculty, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;
      const response = await service.createFaculty(body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  verifyToken,
  HandleCheckRole('admin'),
  handleJoiValidator(createUpdateFaculty, 'body'),
  handleJoiValidator(findFacultyById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const response = await service.updateFaculty(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  verifyToken,
  HandleCheckRole('admin'),
  handleJoiValidator(findFacultyById, 'params'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const response = await service.deleteFaculty(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
