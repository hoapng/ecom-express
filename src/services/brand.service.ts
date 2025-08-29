import { NotFoundRecordException } from '~/errors/error'
import { CreateBrandBodyType, UpdateBrandBodyType } from '~/models/brand.model'
import { PaginationQueryType } from '~/models/request.model'
import { brandRepo, BrandRepo } from '~/repositories/brand.repo'
import { isNotFoundPrismaError } from '~/utils/helper'

export class BrandService {
  constructor(private brandRepo: BrandRepo) {}

  async list(pagination: PaginationQueryType, lang: string) {
    const data = await this.brandRepo.list(pagination, lang)
    return data
  }

  async findById(id: number, lang: string) {
    const brand = await this.brandRepo.findById(id, lang)
    if (!brand) {
      throw NotFoundRecordException
    }
    return brand
  }

  create({ data, createdById }: { data: CreateBrandBodyType; createdById: number }) {
    return this.brandRepo.create({
      createdById,
      data
    })
  }

  async update({ id, data, updatedById }: { id: number; data: UpdateBrandBodyType; updatedById: number }) {
    try {
      const brand = await this.brandRepo.update({
        id,
        updatedById,
        data
      })
      return brand
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.brandRepo.delete({
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

export const brandService = new BrandService(brandRepo)
