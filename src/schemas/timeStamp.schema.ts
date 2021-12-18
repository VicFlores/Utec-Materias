import Joi from 'joi';

const id = Joi.number().integer().required();
const start = Joi.string().required();
const finish = Joi.string().required();
const students = Joi.number().integer().required();

export const findTimeStampById = Joi.object({
  id,
});

export const createUpdateTimeStamp = Joi.object({
  start,
  finish,
  students,
});
