import { NotFoundRecordException } from '~/errors/error'
import { LanguageAlreadyExistsException } from '~/errors/language.error'
import { CreateLanguageBodyType, UpdateLanguageBodyType } from '~/models/language.model'
import { languageRepo, LanguageRepo } from '~/repositories/language.repo'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '~/utils/helper'

export class LanguageService {
  constructor(private languageRepo: LanguageRepo) {}

  async findAll() {
    const data = await this.languageRepo.findAll()
    return {
      data,
      totalItems: data.length
    }
  }

  async findById(id: string) {
    const language = await this.languageRepo.findById(id)
    if (!language) {
      throw NotFoundRecordException
    }
    return language
  }

  async create({ data, createdById }: { data: CreateLanguageBodyType; createdById: number }) {
    try {
      return await this.languageRepo.create({
        createdById,
        data
      })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw LanguageAlreadyExistsException
      }
      throw error
    }
  }

  async update({ id, data, updatedById }: { id: string; data: UpdateLanguageBodyType; updatedById: number }) {
    try {
      const language = await this.languageRepo.update({
        id,
        updatedById,
        data
      })
      return language
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  async delete(id: string) {
    try {
      // hard delete
      await this.languageRepo.delete(id)
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

export const languageService = new LanguageService(languageRepo)
