import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/client'
import envConfig from '~/config/evnConfig'
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prismaService =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: envConfig.NODE_ENV !== 'production' ? ['info', 'warn', 'error'] : ['error']
  })

if (envConfig.NODE_ENV !== 'production') globalForPrisma.prisma = prismaService

export type PrismaService = PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>
