import { userRepository, UserRepository } from '~/repositories/user.repo'
import { hashingService, HashingService } from './hashing.service'
import { NotFoundRecordException } from '~/errors/error'
import { ChangePasswordBodyType, UpdateMeBodyType } from '~/models/profile.model'
import { isUniqueConstraintPrismaError } from '~/utils/helper'
import { InvalidPasswordException } from '~/errors/auth.error'

export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.findUniqueIncludeRolePermissions({
      id: userId,
      deletedAt: null
    })

    if (!user) {
      throw NotFoundRecordException
    }

    return user
  }

  async updateProfile({ userId, body }: { userId: number; body: UpdateMeBodyType }) {
    try {
      return await this.userRepository.update(
        { id: userId },
        {
          ...body,
          updatedById: userId
        }
      )
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  async changePassword({ userId, body }: { userId: number; body: Omit<ChangePasswordBodyType, 'confirmNewPassword'> }) {
    try {
      const { password, newPassword } = body
      const user = await this.userRepository.findUnique({
        id: userId,
        deletedAt: null
      })
      if (!user) {
        throw NotFoundRecordException
      }
      const isPasswordMatch = await this.hashingService.compare(password, user.password)
      if (!isPasswordMatch) {
        throw InvalidPasswordException
      }
      const hashedPassword = await this.hashingService.hash(newPassword)

      await this.userRepository.update(
        { id: userId },
        {
          password: hashedPassword,
          updatedById: userId
        }
      )
      return {
        message: 'Password changed successfully'
      }
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}

export const profileService = new ProfileService(userRepository, hashingService)
