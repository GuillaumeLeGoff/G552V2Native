import { Request, Response, NextFunction } from 'express';
import { UserType } from '../types/user.type';


export interface CustomRequest extends Request {
  user?: UserType;
}

export const extractUser = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  
  if (req.user) {
    req.user.id = Number(req.user.id);
    req.user.username = String(req.user.username);
  }
  next();
};