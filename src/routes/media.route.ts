import { Router } from 'express'
import multer from 'multer'
import { mediaController } from '~/controllers/media.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'
import path from 'path'
import { generateRandomFilename } from '~/utils/helper'

const mediaRouter = Router()

const UPLOAD_DIR = path.resolve('upload')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const newFilename = generateRandomFilename(file.originalname)
    cb(null, newFilename)
  }
})

const upload = multer({ storage })

mediaRouter.post(
  '/images/upload',
  upload.single('file'),
  wrapRequestHandler((req, res, next) => mediaController.uploadFile(req, res, next))
)

export default mediaRouter
