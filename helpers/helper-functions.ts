import Joi from 'joi';
import mongoose from 'mongoose';

import {
  REGEX_LOWERCASE_LETTERS,
  REGEX_NUMBERS,
  REGEX_SPECIAL_CHARACTERS,
  REGEX_UPPERCASE_LETTERS,
} from '../config/consts';

export const validateObjectIDByJoi = (
  id: string,
  helper: Joi.CustomHelpers,
) => {
  const objectId = new mongoose.Types.ObjectId(id);

  if (mongoose.Types.ObjectId.isValid(objectId)) {
    return id;
  } else {
    return helper.error('any.invalid');
  }
};

export const firstLetterUpperCaseInJoi = (str: string) => {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const validationPasswordInJoi = (password: string) => {
  if (password.length < 6) {
    throw new Joi.ValidationError('Length must be grater than 6', [], {});
  }

  if (!password.match(REGEX_LOWERCASE_LETTERS)) {
    throw new Joi.ValidationError(
      'There should be at least one lower case letter.',
      [],
      {},
    );
  }

  if (!password.match(REGEX_UPPERCASE_LETTERS)) {
    throw new Joi.ValidationError(
      'There should be at least one upper case letter.',
      [],
      {},
    );
  }

  if (!password.match(REGEX_NUMBERS)) {
    throw new Joi.ValidationError(
      'There should be at least one number.',
      [],
      {},
    );
  }

  if (!password.match(REGEX_SPECIAL_CHARACTERS)) {
    throw new Joi.ValidationError(
      'There should be at least one special character.',
      [],
      {},
    );
  }

  return password;
};

export const successResponse = <T>(data: T): { success: boolean; data: T } => {
  return {
    success: true,
    data,
  };
};

// todo: phone number validation and format different types of mobile numbers (09... | +98... | 9...) => 09...
// export const phoneNumber
