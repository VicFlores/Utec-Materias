import Joi from 'joi';

const id = Joi.number().integer().required();
const start = Joi.string().required();
const finish = Joi.string().required();
const students = Joi.number().integer().required();
const idClassDetail = Joi.number().required();

export const findTimeStampById = Joi.object({
  id,
});

export const createTimeStamp = Joi.object({
  start,
  idClassDetail,
});

export const updateTimeStamp = Joi.object({
  finish,
  students,
});
