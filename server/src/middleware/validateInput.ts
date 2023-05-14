import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi'

const validateInput = (schema: ObjectSchema) => async (req:Request, res: Response, next: NextFunction) => {
  try {
    await schema.validateAsync(req.body);
    next();
  }
  catch ( err ) {
    return next(err);
  }
};

export default validateInput;

