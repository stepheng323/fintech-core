import { Request, Response, NextFunction } from 'express'
import { respondWithWarning } from '../helpers/responseHandler';
import { verifyToken } from '../helpers/jwt';

export async function checkAuth(req, res: Response, next: NextFunction) {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (!token) {
    return respondWithWarning(res, 401, 'No token provided', null);
  }
  try {
    const auth = verifyToken(token);
    req.auth = auth;
    return next();
  } catch (error: any) {
    if (error.message === 'JsonWebTokenError') return respondWithWarning(res, 401, 'invalid token', null);
    return respondWithWarning(res, 401, error.message, null);
  }
};
