import Joi from 'joi';

import { FILE_MODEL } from '../../interfaces';
import { validateObjectIDByJoi } from '../helper-functions';

export const createFileValidator = Joi.object({
    name: Joi.string().required(),
    originalName: Joi.string().required(),
    model: Joi.string().valid(...Object.values(FILE_MODEL)).required(),
    path: Joi.string().required(),
    type: Joi.string().required(),
    owner: Joi.string().custom(validateObjectIDByJoi).required(),
});

export const getFileValidator = Joi.object({
    fileId: Joi.string().custom(validateObjectIDByJoi).required(),
});

export const changeFilePermissionValidator = Joi.object({
    usersThatCanAccess: Joi.array().items(Joi.string()),
});
