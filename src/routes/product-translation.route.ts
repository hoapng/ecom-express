import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'
import { productTranslationController } from '~/controllers/product-translation.controller'

const productTranslationRouter = Router()

productTranslationRouter.get(
  '/:productTranslationId',
  wrapRequestHandler((req, res, next) => productTranslationController.findById(req, res, next))
)

productTranslationRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => productTranslationController.create(req, res, next))
)

productTranslationRouter.put(
  '/:productTranslationId',
  wrapRequestHandler((req, res, next) => productTranslationController.update(req, res, next))
)

productTranslationRouter.delete(
  '/:productTranslationId',
  wrapRequestHandler((req, res, next) => productTranslationController.delete(req, res, next))
)

export default productTranslationRouter
