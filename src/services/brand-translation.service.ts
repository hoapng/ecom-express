import { BrandTranslationAlreadyExistsException } from '~/errors/brand-translation.error'
import { NotFoundRecordException } from '~/errors/error'
import { CreateBrandTranslationBodyType, UpdateBrandTranslationBodyType } from '~/models/brand-translation.model'
import { brandTranslationRepo, BrandTranslationRepo } from '~/repositories/brand-translation.repo'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '~/utils/helper'

export class BrandTranslationService {
  constructor(private brandTranslationRepo: BrandTranslationRepo) {}

  async findById(id: number) {
    const brand = await this.brandTranslationRepo.findById(id)
    if (!brand) {
      throw NotFoundRecordException
    }
    return brand
  }

  async create({ data, createdById }: { data: CreateBrandTranslationBodyType; createdById: number }) {
    try {
      return await this.brandTranslationRepo.create({
        createdById,
        data
      })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistsException
      }
      throw error
    }
  }

  async update({ id, data, updatedById }: { id: number; data: UpdateBrandTranslationBodyType; updatedById: number }) {
    try {
      const brand = await this.brandTranslationRepo.update({
        id,
        updatedById,
        data
      })
      return brand
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw BrandTranslationAlreadyExistsException
      }
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.brandTranslationRepo.delete({
        id,
        deletedById
      })
      return {
        message: 'Delete successfully'
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}

export const brandTranslationService = new BrandTranslationService(brandTranslationRepo)
