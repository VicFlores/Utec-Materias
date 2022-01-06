import Joi from 'joi';

const id = Joi.number().integer().required();
const class_type = Joi.string().required();
const classroom = Joi.string().required();
const inscribed = Joi.number().integer().required();
const idUser = Joi.number().integer().required();
const idSubject = Joi.number().integer().required();
const idSection = Joi.number().integer().required();
const idFaculty = Joi.number().integer().required();

export const findClassDetailById = Joi.object({
  id,
});

export const createUpdateClassDetail = Joi.object({
  inscribed,
  class_type,
  classroom,
  idUser,
  idSubject,
  idSection,
  idFaculty,
});
