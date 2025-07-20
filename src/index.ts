import express, { NextFunction, Request, Response } from 'express'
import envConfig from './config/evnConfig'
import authRouter from './routes/auth.route'
import { bootstrap, initialScript } from './config/initialScript'
import { logger } from './config/logger'
import z from 'zod'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import requestIp from 'request-ip'
import cors from 'cors'
import languageRouter from './routes/language.route'
import permissionRouter from './routes/permission.route'

const app = express()
const PORT = envConfig.PORT || 8080

app.use(cors())

app.use(requestIp.mw(), express.json())

app.use('/auth', authRouter)

app.use('/languages', languageRouter)

app.use('/permissions', permissionRouter)

app.use((req: any, res: Response, next: NextFunction) => {
  const statusCode = +req.statusCode || StatusCodes.CREATED
  return res.status(statusCode).json({ statusCode, data: req.data })
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    err = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, { message: err.issues })
  }
  logger.error({ ...err })
  console.error(err)
  return res.status(+err.status || 500).json({
    statusCode: err.status || 500,
    message: err.message,
    error: err.name || 'Error'
  })
})

app.listen(PORT, () => {
  logger.info(`My app is running on port: ${PORT}`)
})

bootstrap(app)

initialScript()
  .then(({ adminUser, createdRoleCount }) => {
    logger.info(`Created ${createdRoleCount} roles`)
    logger.info(`Created admin user: ${adminUser.email}`)
  })
  .catch((e) => logger.info(e.message))
