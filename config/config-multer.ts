import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

import { ACCEPTED_FILE_TYPES } from './consts';

const storage = multer.diskStorage({
  destination(req, _file, callback) {
    callback(null, `public/${req.params.model}-file`);
  },
  filename(_req, file, callback) {
    callback(null, `${Date.now()}.${file.mimetype.split('/')[1]}`);
  },
});

const fileFilter = function (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) {
  if (!ACCEPTED_FILE_TYPES.includes(file.mimetype)) {
    callback(new Error('File type isn\'t acceptable!'));
  } else {
    callback(null, true);
  }
};

export const upload = multer({ storage, fileFilter });
