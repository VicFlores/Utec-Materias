import express from 'express';
import userRouter from './user.router';
import sectionRouter from './section.route';
import subjectRouter from './subject.route';
import authRouter from './auth.route';

const routerApi = (app: express.Application) => {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/users', userRouter);
  router.use('/sections', sectionRouter);
  router.use('/subjects', subjectRouter);
  router.use('/login', authRouter);
};

export default routerApi;
