import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import path from 'path'
import envConfig from '~/config/evnConfig'
import { UPLOAD_DIR } from '~/constants/other.constant'

export class MediaController {
  uploadFile(req: Request, res: Response, next: NextFunction) {
    req.data = req.files?.map((file) => ({
      url: `${envConfig.PREFIX_STATIC_ENDPOINT}/${file.filename}`
    }))
    next()
    return Promise.resolve()
  }

  serveFile(req: Request, res: Response, next: NextFunction) {
    const { filename } = req.params
    res.sendFile(path.resolve(UPLOAD_DIR, filename), (error) => {
      if (error) {
        throw createHttpError.NotFound(`File not found`)
      }
    })
    return Promise.resolve()
  }
}

export const mediaController = new MediaController()
