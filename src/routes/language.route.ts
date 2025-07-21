import { Router } from 'express'
import { languageController } from '~/controllers/language.controller'
import { auth } from '~/midlewares/authentication.guard'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const languageRouter = Router()

languageRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => languageController.findAll(req, res, next))
)

languageRouter.get(
  '/:id',
  wrapRequestHandler((req, res, next) => languageController.findById(req, res, next))
)

languageRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => languageController.create(req, res, next))
)

languageRouter.put(
  '/:id',
  wrapRequestHandler((req, res, next) => languageController.update(req, res, next))
)

languageRouter.delete(
  '/:id',
  wrapRequestHandler((req, res, next) => languageController.delete(req, res, next))
)

export default languageRouter
