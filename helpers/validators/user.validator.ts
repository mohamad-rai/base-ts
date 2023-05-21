import Joi from 'joi';

import { USER_GENDER, USER_ROLE } from '../../interfaces';
import {
  firstLetterUpperCaseInJoi,
  validateObjectIDByJoi,
  validationPasswordInJoi,
} from '../helper-functions';

const commonUserFields = {
  picture: Joi.string(),
  mobile: Joi.string().min(11).max(11),
  role: Joi.string().valid(...Object.keys(USER_ROLE)),
};

export const createUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(4)
    .max(30)
    .custom(validationPasswordInJoi)
    .required(),
  repeat_password: Joi.ref('password'),
  firstName: Joi.string()
    .min(3)
    .max(15)
    .custom(firstLetterUpperCaseInJoi)
    .required(),
  lastName: Joi.string()
    .min(3)
    .max(15)
    .custom(firstLetterUpperCaseInJoi)
    .required(),
  gender: Joi.string()
    .uppercase()
    .valid(...Object.keys(USER_GENDER))
    .required(),
  ...commonUserFields,
});

export const updateUserValidator = Joi.object({
  email: Joi.string().email().lowercase(),
  password: Joi.string().min(4).max(30).custom(validationPasswordInJoi),
  repeat_password: Joi.ref('password'),
  firstName: Joi.string().min(3).max(15).custom(firstLetterUpperCaseInJoi),
  lastName: Joi.string().min(3).max(15).custom(firstLetterUpperCaseInJoi),
  gender: Joi.string()
    .uppercase()
    .valid(...Object.keys(USER_GENDER)),
  ...commonUserFields,
});

export const getUserValidator = Joi.object({
  userId: Joi.string().custom(
    validateObjectIDByJoi,
    'mongodb object id validation',
  ),
});
