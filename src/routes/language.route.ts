import { Router } from 'express'
import { languageController } from '~/controllers/language.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const languageRouter = Router()

languageRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => languageController.findAll(req, res, next))
)

languageRouter.get(
  '/:languageId',
  wrapRequestHandler((req, res, next) => languageController.findById(req, res, next))
)

languageRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => languageController.create(req, res, next))
)

languageRouter.put(
  '/:languageId',
  wrapRequestHandler((req, res, next) => languageController.update(req, res, next))
)

languageRouter.delete(
  '/:languageId',
  wrapRequestHandler((req, res, next) => languageController.delete(req, res, next))
)

export default languageRouter
