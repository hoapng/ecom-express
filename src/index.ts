import express, { NextFunction, Request, Response } from 'express'

import { prismaService } from './services/prisma.service'
import { RoleName } from './constants/role.constant'
import { HashingService } from './services/hashing.service'
import envConfig from './config/evnConfig'
import authRouter from './routes/auth.route'

const app = express()
const PORT = envConfig.PORT || 8080

app.use(express.json())

app.use('/auth', authRouter)

app.use((req: any, res: Response, next: NextFunction) => {
  return res.status(+req.statusCode).json({ statusCode: req.statusCode, data: req.data })
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(+err.status || 500).json({
    statusCode: err.status || 500,
    message: err.message,
    error: err.name || 'Error'
  })
})

app.listen(PORT, () => {
  console.log(`My app is running on port: ${PORT}`)
})

const main = async () => {
  const roleCount = await prismaService.role.count()
  if (roleCount > 0) {
    throw new Error('Database already')
  }
  const roles = await prismaService.role.createMany({
    data: [
      {
        name: RoleName.Admin,
        description: 'Admin role'
      },
      {
        name: RoleName.Client,
        description: 'Client role'
      },
      {
        name: RoleName.Seller,
        description: 'Seller role'
      }
    ]
  })

  const adminRole = await prismaService.role.findFirstOrThrow({
    where: {
      name: RoleName.Admin
    }
  })
  const hashedPassword = await HashingService.hash(envConfig.ADMIN_PASSWORD)
  const adminUser = await prismaService.user.create({
    data: {
      email: envConfig.ADMIN_EMAIL,
      password: hashedPassword,
      name: envConfig.ADMIN_NAME,
      phoneNumber: envConfig.ADMIN_PHONE_NUMBER,
      roleId: adminRole.id
    }
  })
  return {
    createdRoleCount: roles.count,
    adminUser
  }
}

main()
  .then(({ adminUser, createdRoleCount }) => {
    console.log(`Created ${createdRoleCount} roles`)
    console.log(`Created admin user: ${adminUser.email}`)
  })
  .catch((e) => console.log(e.message))
