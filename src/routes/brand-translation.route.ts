import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'
import { brandTranslationController } from '~/controllers/brand-translation.controller'

const brandTranslationRouter = Router()

brandTranslationRouter.get(
  '/:brandTranslationId',
  wrapRequestHandler((req, res, next) => brandTranslationController.findById(req, res, next))
)

brandTranslationRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => brandTranslationController.create(req, res, next))
)

brandTranslationRouter.put(
  '/:brandTranslationId',
  wrapRequestHandler((req, res, next) => brandTranslationController.update(req, res, next))
)

brandTranslationRouter.delete(
  '/:brandTranslationId',
  wrapRequestHandler((req, res, next) => brandTranslationController.delete(req, res, next))
)

export default brandTranslationRouter
