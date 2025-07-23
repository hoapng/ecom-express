import { NextFunction, Request, Response } from 'express'

export class MediaController {
  uploadFile(req: Request, res: Response, next: NextFunction) {
    console.log(req.file)
    req.data = req.file
    next()
    return Promise.resolve()
  }
}

export const mediaController = new MediaController()
