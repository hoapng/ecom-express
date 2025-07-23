import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

export const NotFoundRecordException = createHttpError.NotFound('Error.NotFound')
