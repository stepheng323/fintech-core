import Jwt from 'jsonwebtoken';
import { TOKEN_SECRET_KEY, TOKEN_EXPIRATION } from '../config/env'

export const generateToken = async (data: string | object, expiresIn?: any) => {
  const token = Jwt.sign(data, TOKEN_SECRET_KEY as string, {
    expiresIn: expiresIn || TOKEN_EXPIRATION,
  });
  return token;
};


export const verifyToken = (token: string) => Jwt.verify(token, TOKEN_SECRET_KEY!);
