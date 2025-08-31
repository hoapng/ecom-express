import { NotFoundRecordException } from '~/errors/error'
import { CreateProductBodyType, GetProductsQueryType, UpdateProductBodyType } from '~/models/product.model'
import { productRepo, ProductRepo } from '~/repositories/product.repo'
import { isNotFoundPrismaError } from '~/utils/helper'

export class ProductService {
  constructor(private productRepo: ProductRepo) {}

  async list(props: { query: GetProductsQueryType }, lang: string) {
    const data = await this.productRepo.list({
      page: props.query.page,
      limit: props.query.limit,
      languageId: lang,
      isPublic: true
    })
    return data
  }

  async getDetail(props: { productId: number }, lang: string) {
    const product = await this.productRepo.getDetail({
      productId: props.productId,
      languageId: lang,
      isPublic: true
    })
    if (!product) {
      throw NotFoundRecordException
    }
    return product
  }
}

export const productService = new ProductService(productRepo)
