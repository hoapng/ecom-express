import createHttpError from 'http-errors'

export const NotFoundRecordException = createHttpError.NotFound('Error.NotFound')
