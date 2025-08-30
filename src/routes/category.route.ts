import { Router } from 'express'
import { categoryController } from '~/controllers/category.controller'
import { auth } from '~/midlewares/authentication.guard'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const categoryRouter = Router()

categoryRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => categoryController.findAll(req, res, next))
)

categoryRouter.get(
  '/:categoryId',
  wrapRequestHandler((req, res, next) => categoryController.findById(req, res, next))
)

categoryRouter.post(
  '/',
  auth(),
  wrapRequestHandler((req, res, next) => categoryController.create(req, res, next))
)

categoryRouter.put(
  '/:categoryId',
  auth(),
  wrapRequestHandler((req, res, next) => categoryController.update(req, res, next))
)

categoryRouter.delete(
  '/:categoryId',
  auth(),
  wrapRequestHandler((req, res, next) => categoryController.delete(req, res, next))
)

export default categoryRouter
