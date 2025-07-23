import { Router } from 'express'
import { profileController } from '~/controllers/profile.controller'
import { wrapRequestHandler } from '~/utils/wrapRequestHandler'

const profileRouter = Router()

profileRouter.get(
  '/',
  wrapRequestHandler((req, res, next) => profileController.getProfile(req, res, next))
)

profileRouter.put(
  '/',
  wrapRequestHandler((req, res, next) => profileController.updateProfile(req, res, next))
)

profileRouter.put(
  '/change-password',
  wrapRequestHandler((req, res, next) => profileController.changePassword(req, res, next))
)

export default profileRouter
