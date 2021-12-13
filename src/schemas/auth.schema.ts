import Joi from 'joi';

const email = Joi.string().email().required();
const passwd = Joi.string().required();

export const postLogin = Joi.object({
  email,
  passwd,
});
