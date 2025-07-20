import { RoleName } from '~/constants/role.constant'
import { NotFoundRecordException } from '~/errors/error'
import { RoleAlreadyExistsException } from '~/errors/role.error'
import { RoleType } from '~/models/auth.model'
import { CreateRoleBodyType, GetRolesQueryType, UpdateRoleBodyType } from '~/models/role.model'
import { roleRepo, RoleRepo } from '~/repositories/role.repo'
import { PrismaService, prismaService } from '~/services/prisma.service'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from '~/utils/helper'

export class RoleService {
  private clientRoleId: number | null = null

  constructor(
    private readonly prismaService: PrismaService,
    private roleRepo: RoleRepo
  ) {}

  async getClientRoleId() {
    if (this.clientRoleId) {
      return this.clientRoleId
    }
    const role: RoleType = await this.prismaService.$queryRaw<RoleType[]>`
      SELECT * FROM "Role" WHERE name = ${RoleName.Client} AND "deletedAt" IS NULL LIMIT 1;
    `.then((res: RoleType[]) => {
      if (res.length === 0) {
        throw new Error('Client role not found')
      }
      return res[0]
    })
    this.clientRoleId = role.id
    return role.id
  }

  async list(pagination: GetRolesQueryType) {
    const data = await this.roleRepo.list(pagination)
    return data
  }

  async findById(id: number) {
    const role = await this.roleRepo.findById(id)
    if (!role) {
      throw NotFoundRecordException
    }
    return role
  }

  async create({ data, createdById }: { data: CreateRoleBodyType; createdById: number }) {
    try {
      const role = await this.roleRepo.create({
        createdById,
        data
      })
      return role
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw RoleAlreadyExistsException
      }
      throw error
    }
  }

  async update({ id, data, updatedById }: { id: number; data: UpdateRoleBodyType; updatedById: number }) {
    try {
      const role = await this.roleRepo.update({
        id,
        updatedById,
        data
      })
      return role
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      if (isUniqueConstraintPrismaError(error)) {
        throw RoleAlreadyExistsException
      }
      throw error
    }
  }

  async delete({ id, deletedById }: { id: number; deletedById: number }) {
    try {
      await this.roleRepo.delete({
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

export const roleService = new RoleService(prismaService, roleRepo)
