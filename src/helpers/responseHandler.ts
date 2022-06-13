import { Response } from 'express'
export const respondWithSuccess = (res: Response, statusCode = 200, message: string, payload?: any) => {
  return res.status(statusCode).send({
    success: true,
    message,
    payload,
  })
}

export const respondWithWarning = (res: Response, statusCode = 500, message: string, payload?: any) => {
  console.log(message);

  return res.status(statusCode).send({
    success: false,
    message,
    payload,
  })
}