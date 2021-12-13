import Joi from 'joi';

const id = Joi.number().integer().required();
const firstname = Joi.string().required();
const lastname = Joi.string().required();
const email = Joi.string().email().required();
const passwd = Joi.string().min(8).required();
const roles = Joi.string();

export const findUserById = Joi.object({
  id,
});

export const createUser = Joi.object({
  firstname,
  lastname,
  email,
  passwd,
});

export const updateUser = Joi.object({
  firstname,
  lastname,
  email,
});

export const updateEspecialUser = Joi.object({
  roles,
});
