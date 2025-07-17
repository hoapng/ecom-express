import express, { NextFunction, Request, Response } from 'express'
import envConfig from './config/evnConfig'
import authRouter from './routes/auth.route'
import { initialScript } from './config/initialScript'
import { logger } from './config/logger'
import z from 'zod'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import requestIp from 'request-ip'
import cors from 'cors'

const app = express()
const PORT = envConfig.PORT || 8080

app.use(cors())

app.use(requestIp.mw(), express.json())

app.use('/auth', authRouter)

app.use((req: any, res: Response, next: NextFunction) => {
  return res.status(+req.statusCode).json({ statusCode: req.statusCode, data: req.data })
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof z.ZodError) {
    err = createHttpError(StatusCodes.UNPROCESSABLE_ENTITY, { message: err.issues })
  }
  res.status(+err.status || 500).json({
    statusCode: err.status || 500,
    message: err.message,
    error: err.name || 'Error'
  })
  return logger.error(err)
})

app.listen(PORT, () => {
  logger.info(`My app is running on port: ${PORT}`)
})

initialScript()
  .then(({ adminUser, createdRoleCount }) => {
    logger.info(`Created ${createdRoleCount} roles`)
    logger.info(`Created admin user: ${adminUser.email}`)
  })
  .catch((e) => logger.info(e.message))
