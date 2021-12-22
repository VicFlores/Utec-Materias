import Joi from 'joi';

const id = Joi.number().integer().required();
const id_class_detail = Joi.number().integer().required();
const id_time_stamp = Joi.number().integer().required();

export const findHistorialById = Joi.object({
  id,
});

export const createUpdateHistorial = Joi.object({
  id_class_detail,
  id_time_stamp,
});
