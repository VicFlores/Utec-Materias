import Joi from 'joi';

const id = Joi.number().integer().required();
const name = Joi.string().required();
const cod_subject = Joi.string().required();

export const findSubjectById = Joi.object({
  id,
});

export const createUpdateSubject = Joi.object({
  name,
  cod_subject,
});
