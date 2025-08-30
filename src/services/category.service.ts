import { NotFoundRecordException } from '~/errors/error'
import { CreateCategoryBodyType, UpdateCategoryBodyType } from '~/models/category.model'
import { categoryRepo, CategoryRepo } from '~/repositories/category.repo'
import { isNotFoundPrismaError } from '~/utils/helper'

export class CategoryService {
  constructor(private categoryRepo: CategoryRepo) {}

  findAll(lang: string, parentCategoryId?: number | null) {
    return this.categoryRepo.findAll({
      parentCategoryId,
      languageId: lang
    })
  }

  async findById(id: number, lang: string) {
    const category = await this.categoryRepo.findById({
      id,
      languageId: lang
    })
    if (!category) {
      throw NotFoundRecordException
    }
    return category
  }

  create({ data, createdById }: { data: CreateCategoryBodyType; createdById: number }) {
    return this.categoryRepo.create({
      createdById,
      data
    })
  }

  async update({ id, data, updatedById }: { id: number; data: UpdateCategoryBodyType; updatedById: number }) {
    try {
      const category = await this.categoryRepo.update({
        id,
        updatedById,
        data
      })
      return category
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.categoryRepo.delete({
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

export const categoryService = new CategoryService(categoryRepo)
