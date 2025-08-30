import { ALL_LANGUAGE_CODE } from '~/constants/other.constant'
import { GetProductsQueryType, GetProductsResType } from '~/models/product.model'
import { prismaService, PrismaService } from '~/services/prisma.service'

export class ProductRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async list(query: GetProductsQueryType, languageId: string): Promise<GetProductsResType> {
    const skip = (query.page - 1) * query.limit
    const take = query.limit
    const [totalItems, data] = await Promise.all([
      this.prismaService.product.count({
        where: {
          deletedAt: null
        }
      }),
      this.prismaService.product.findMany({
        where: {
          deletedAt: null
        },
        include: {
          productTranslations: {
            where: languageId === ALL_LANGUAGE_CODE ? { deletedAt: null } : { languageId, deletedAt: null }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take
      })
    ])
    return {
      data,
      totalItems,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(totalItems / query.limit)
    }
  }
}

export const productRepo = new ProductRepo(prismaService)
