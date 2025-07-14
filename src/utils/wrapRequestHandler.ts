import { Request, Response, NextFunction } from 'express'

export const wrapRequestHandler = (func: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      return next(error)
    }
  }
}
