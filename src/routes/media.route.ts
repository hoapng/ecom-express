import { Router } from 'express'
import multer from 'multer'
import { mediaController } from '~/controllers/media.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'
import path from 'path'
import { generateRandomFilename } from '~/utils/helper'
import { existsSync, mkdirSync } from 'fs'

const mediaRouter = Router()

const UPLOAD_DIR = path.resolve('upload')

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
    fileSize: 1 * 1024 * 1024 // 1MB
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
    cb(null, allowedImageTypes.includes(file.mimetype))
  }
})

mediaRouter.post(
  '/images/upload',
  upload.single('file'),
  wrapRequestHandler((req, res, next) => mediaController.uploadFile(req, res, next))
)

export default mediaRouter
