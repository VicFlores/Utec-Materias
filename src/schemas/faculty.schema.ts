import Joi from 'joi';

const id = Joi.number().integer().required();
const name = Joi.string().required();
const school = Joi.string().required();

export const findFacultyById = Joi.object({
  id,
});

export const createUpdateFaculty = Joi.object({
  name,
  school,
});
