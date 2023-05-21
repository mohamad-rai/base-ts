import Joi from 'joi';

import { validationPasswordInJoi } from '../helper-functions';

export const loginValidator = Joi.object({
  email: Joi.string().email().lowercase(),
  password: Joi.string()
    .min(4)
    .max(30)
    .custom(validationPasswordInJoi),
});

export const refreshTokenValidation = Joi.object({
  refreshToken: Joi.string().required(),
});
