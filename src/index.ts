import express, { NextFunction, Request, Response } from 'express'
import envConfig from './config/evnConfig'
import authRouter from './routes/auth.route'
import { logger } from './config/logger'
import z from 'zod'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import requestIp from 'request-ip'
import cors from 'cors'
import languageRouter from './routes/language.route'
import permissionRouter from './routes/permission.route'
import { auth } from './midlewares/authentication.guard'
import roleRouter from './routes/role.route'
import profileRouter from './routes/profile.route'
import userRouter from './routes/user.route'
import mediaRouter from './routes/media.route'
import brandTranslationRouter from './routes/brand-translation.route'
import brandRouter from './routes/brand.route'
import i18n from 'i18n'
import path from 'path'
import categoryTranslationRouter from './routes/category-translation.route'
import categoryRouter from './routes/category.route'
import productTranslationRouter from './routes/product-translation.route'
import productRouter from './routes/product.route'
import { main } from './initialScript'
import { bootstrap } from './initialScript/create-permissions'

const app = express()
const PORT = envConfig.PORT || 8080

app.use(cors())

app.use(requestIp.mw(), express.json())

i18n.configure({
  locales: ['en', 'vi'],
  directory: path.resolve('src/i18n/'),
  objectNotation: true,
  queryParameter: 'lang',
  header: 'accept-language',
  defaultLocale: 'en'
})

app.use(i18n.init)

app.use('/auth', authRouter)

app.use('/languages', auth(), languageRouter)

app.use('/permissions', auth(), permissionRouter)

app.use('/roles', auth(), roleRouter)

app.use('/profile', auth(), profileRouter)

app.use('/users', auth(), userRouter)

app.use('/media', mediaRouter)

app.use('/brand-translations', auth(), brandTranslationRouter)

app.use('/brands', brandRouter)

app.use('/category-translations', auth(), categoryTranslationRouter)

app.use('/categories', auth(), categoryRouter)

app.use('/product-translations', auth(), productTranslationRouter)

app.use('/products', auth(), productRouter)

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

main()
  .then(({ adminUser, createdRoleCount }) => {
    logger.info(`Created ${createdRoleCount} roles`)
    logger.info(`Created admin user: ${adminUser.email}`)
  })
  .catch((e) => logger.info(e.message))
