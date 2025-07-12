import { Request, Response, NextFunction, RequestHandler } from 'express'

export const wrapRequestHandler = (func: (req: any, res: any, next: NextFunction) => Promise<any>) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      return next(error)
    }
  }
}
