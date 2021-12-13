import Joi from 'joi';

const id = Joi.number().integer().required();
const sections = Joi.number().required();
const hours = Joi.string().required();
const days = Joi.string().required();

export const findSectionById = Joi.object({
  id,
});

export const createUpdateSection = Joi.object({
  sections,
  hours,
  days,
});
