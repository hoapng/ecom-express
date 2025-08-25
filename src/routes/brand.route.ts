import { Router } from 'express'
import { brandController } from '~/controllers/brand.controller'
import { auth } from '~/midlewares/authentication.guard'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const brandRouter = Router()

brandRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => brandController.list(req, res, next))
)

brandRouter.get(
  '/:brandId',
  wrapRequestHandler((req, res, next) => brandController.findById(req, res, next))
)

brandRouter.post(
  '/',
  auth(),
  wrapRequestHandler((req, res, next) => brandController.create(req, res, next))
)

brandRouter.put(
  '/:brandId',
  auth(),
  wrapRequestHandler((req, res, next) => brandController.update(req, res, next))
)

brandRouter.delete(
  '/:brandId',
  auth(),
  wrapRequestHandler((req, res, next) => brandController.delete(req, res, next))
)

export default brandRouter
