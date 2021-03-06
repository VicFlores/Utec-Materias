import express from 'express';
import userRouter from './user.router';
import sectionRouter from './section.route';
import subjectRouter from './subject.route';
import facultyRouter from './faculty.route';
import timeStampRouter from './timeStamp.route';
import classDetailRouter from './classDetail.route';
import historialRouter from './historial.route';
import authRouter from './auth.route';

const routerApi = (app: express.Application) => {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/users', userRouter);
  router.use('/sections', sectionRouter);
  router.use('/subjects', subjectRouter);
  router.use('/faculties', facultyRouter);
  router.use('/timestamp', timeStampRouter);
  router.use('/classdetail', classDetailRouter);
  router.use('/historial', historialRouter);
  router.use('/login', authRouter);
};

export default routerApi;
