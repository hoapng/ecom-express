import { Router } from 'express'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'
import { categoryTranslationController } from '~/controllers/category-translation.controller'

const categoryTranslationRouter = Router()

categoryTranslationRouter.get(
  '/:categoryTranslationId',
  wrapRequestHandler((req, res, next) => categoryTranslationController.findById(req, res, next))
)

categoryTranslationRouter.post(
  '/',
  wrapRequestHandler((req, res, next) => categoryTranslationController.create(req, res, next))
)

categoryTranslationRouter.put(
  '/:categoryTranslationId',
  wrapRequestHandler((req, res, next) => categoryTranslationController.update(req, res, next))
)

categoryTranslationRouter.delete(
  '/:categoryTranslationId',
  wrapRequestHandler((req, res, next) => categoryTranslationController.delete(req, res, next))
)

export default categoryTranslationRouter
