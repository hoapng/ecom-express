import { Router } from 'express'
import multer from 'multer'
import { mediaController } from '~/controllers/media.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'
import { generateRandomFilename } from '~/utils/helper'
import { existsSync, mkdirSync } from 'fs'
import createHttpError from 'http-errors'
import { UPLOAD_DIR } from '~/constants/other.constant'
import { auth } from '~/midlewares/authentication.guard'

const mediaRouter = Router()

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const newFilename = generateRandomFilename(file.originalname)
    cb(null, newFilename)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(
        createHttpError.BadRequest(
          `Validation failed (current file type is ${file.mimetype}, expected type is /(jpg|jpeg|png|webp)$/)`
        )
      )
    }
  }
}).array('files')

mediaRouter.post(
  '/images/upload',
  auth(),
  function (req, res, next) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        next(createHttpError.PayloadTooLarge(err.message))
      } else if (err) {
        next(err)
      }
      next()
    })
  },
  wrapRequestHandler((req, res, next) => mediaController.uploadFile(req, res, next))
)

mediaRouter.get(
  '/static/:filename',
  wrapRequestHandler((req, res, next) => mediaController.serveFile(req, res, next))
)

export default mediaRouter
