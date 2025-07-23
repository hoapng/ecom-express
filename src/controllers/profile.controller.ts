import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import { ChangePasswordBodySchema, UpdateMeBodySchema } from '~/models/profile.model'
import { MessageResSchema } from '~/models/response.model'
import { GetUserProfileResSchema, UpdateProfileResSchema } from '~/models/user.model'
import { profileService, ProfileService } from '~/services/profile.service'

export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  async getProfile(req: Request, res: Response, next: NextFunction) {
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.profileService.getProfile(userId)
    req.data = GetUserProfileResSchema.parse(data)
    return next()
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    const body = UpdateMeBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.profileService.updateProfile({
      userId,
      body
    })
    req.data = UpdateProfileResSchema.parse(data)
    return next()
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const body = ChangePasswordBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.profileService.changePassword({
      userId,
      body
    })
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const profileController = new ProfileController(profileService)
