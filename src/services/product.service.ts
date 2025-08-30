import { NotFoundRecordException } from '~/errors/error'
import { CreateProductBodyType, GetProductsQueryType, UpdateProductBodyType } from '~/models/product.model'
import { productRepo, ProductRepo } from '~/repositories/product.repo'
import { isNotFoundPrismaError } from '~/utils/helper'

export class ProductService {
  constructor(private productRepo: ProductRepo) {}

  async list(query: GetProductsQueryType, lang: string) {
    const data = await this.productRepo.list(query, lang)
    return data
  }

  async findById(id: number, lang: string) {
    const product = await this.productRepo.findById(id, lang)
    if (!product) {
      throw NotFoundRecordException
    }
    return product
  }

  create({ data, createdById }: { data: CreateProductBodyType; createdById: number }) {
    return this.productRepo.create({
      createdById,
      data
    })
  }

  async update({ id, data, updatedById }: { id: number; data: UpdateProductBodyType; updatedById: number }) {
    try {
      const product = await this.productRepo.update({
        id,
        updatedById,
        data
      })
      return product
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.productRepo.delete({
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

export const productService = new ProductService(productRepo)
