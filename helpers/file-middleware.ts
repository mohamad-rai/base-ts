import { NextFunction, Request, Response } from 'express';

import { generateError } from './error-helper';
import { upload } from '../config/config-multer';
import { IErrors } from '../interfaces';

export const uploadFileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.single('file')(req, res, async (err) => {
    try {
      if (err || !req.file || !req.user) {
        throw generateError(
          [
            {
              key: IErrors.VALIDATION_ERROR,
              message: err.message || 'Failed to upload the media',
            },
          ],
          'BAD_REQUEST',
        );
      }

      next();
    } catch (e) {
      next(e);
    }
  });
};
