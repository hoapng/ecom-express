import {
  CategoryTranslationType,
  CreateCategoryTranslationBodyType,
  GetCategoryTranslationDetailResType,
  UpdateCategoryTranslationBodyType
} from '~/models/category-translation.model'
import { prismaService, PrismaService } from '~/services/prisma.service'

export class CategoryTranslationRepo {
  constructor(private prismaService: PrismaService) {}

  findById(id: number): Promise<GetCategoryTranslationDetailResType | null> {
    return this.prismaService.categoryTranslation.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
  }

  create({
    createdById,
    data
  }: {
    createdById: number | null
    data: CreateCategoryTranslationBodyType
  }): Promise<CategoryTranslationType> {
    return this.prismaService.categoryTranslation.create({
      data: {
        ...data,
        createdById
      }
    })
  }

  async update({
    id,
    updatedById,
    data
  }: {
    id: number
    updatedById: number
    data: UpdateCategoryTranslationBodyType
  }): Promise<CategoryTranslationType> {
    return this.prismaService.categoryTranslation.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        ...data,
        updatedById
      }
    })
  }

  delete(
    {
      id,
      deletedById
    }: {
      id: number
      deletedById: number
    },
    isHard?: boolean
  ): Promise<CategoryTranslationType> {
    return isHard
      ? this.prismaService.categoryTranslation.delete({
          where: {
            id
          }
        })
      : this.prismaService.categoryTranslation.update({
          where: {
            id,
            deletedAt: null
          },
          data: {
            deletedAt: new Date(),
            deletedById
          }
        })
  }
}

export const categoryTranslationRepo = new CategoryTranslationRepo(prismaService)
