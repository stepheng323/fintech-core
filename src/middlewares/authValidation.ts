/* eslint-disable max-len */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { joiValidator } from '../helpers/joi';
import { respondWithWarning } from '../helpers/responseHandler';

export const validateSignup = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const result = await joiValidator(req.body, schema);
  if (!result) return next();
  return respondWithWarning(res, 400, result, {});
};


export const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const result = await joiValidator(req.body, schema);
  if (!result) return next();
  return respondWithWarning(res, 400, result, {});
};