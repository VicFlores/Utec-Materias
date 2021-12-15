import Joi from 'joi';

const id = Joi.number().integer().required();
const type = Joi.string().required();
const class_type = Joi.string().required();

export const findModalityById = Joi.object({
  id,
});

export const createUpdateModality = Joi.object({
  type,
  class_type,
});
