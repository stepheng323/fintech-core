import { Request, Response, NextFunction } from 'express';

export const catchAsync = (func: any) => (req: Request, res: Response, next: NextFunction) => {
    return func(req, res, next).catch(next);
};