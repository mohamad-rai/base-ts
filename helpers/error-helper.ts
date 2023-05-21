import { NextFunction, Request, Response } from 'express';
import { ValidationError, ValidationErrorItem } from 'joi';

import { HTTP_STATUS, IErrorForm, IErrors } from '../interfaces';

export class CustomError {
  constructor(
    public error: { errors: IErrorForm[]; status: keyof typeof HTTP_STATUS },
  ) {}
}

export const generateError = (
  messages: IErrorForm[],
  status: keyof typeof HTTP_STATUS,
) => {
  if (messages.length === 0 || !messages[0].key) {
    if (status === 'NOT_FOUND')
      messages.push({ message: 'Object not found!', key: IErrors.NOT_FOUND });
    else if (status === 'UNAUTHORIZED')
      messages.push({ message: 'Unauthorized', key: IErrors.UNAUTHORIZED });
  }

  return new CustomError({ errors: messages, status });
};

export const errorHandler = (
  exception: Error | ValidationError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (exception instanceof ValidationError) {
    if (exception.isJoi)
      return res.status(400).json({
        success: false,
        errors: [<IErrorForm>{
          key: IErrors.VALIDATION_ERROR,
          message:
            exception.details
              .map((each: ValidationErrorItem) =>
                each.message.match('because')
                  ? each.message.split('because')[1].trim()
                  : each.message,
              )
              .join(', '),
          extra: exception.details.map(
            (each: ValidationErrorItem) => each.context?.key,
          ),
        }],
      });
  } else if (exception instanceof CustomError) {
    return res
      .status(HTTP_STATUS[exception.error.status])
      .json({ success: false, errors: exception.error.errors });
  }
  console.error(exception);
  res.status(500).json({ code: 500, message: 'Server Error' });
  return next();
};
