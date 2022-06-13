import { Request, Response, NextFunction } from 'express';
import { joiValidator } from '../helpers/joi';
import Joi from 'joi';
import { respondWithWarning } from '../helpers/responseHandler';

export const validateAddBeneficiary = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const result = await joiValidator(req.body, schema);
  if (!result) return next();
  return respondWithWarning(res, 400, result, {});
};


export const validateTransfer = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    amount: Joi.number().integer().min(1).required(),
    email: Joi.string().email().required(),
  });

  const result = await joiValidator(req.body, schema);
  if (!result) return next();
  return respondWithWarning(res, 400, result, {});
};

export const validateAccountFunding = async (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    amount: Joi.number().integer().min(1).required(),
  });

  const result = await joiValidator(req.body, schema);
  if (!result) return next();
  return respondWithWarning(res, 400, result, {});
};