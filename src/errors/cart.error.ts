import createHttpError from 'http-errors'

export const NotFoundSKUException = createHttpError.NotFound('Error.SKU.NotFound')

export const OutOfStockSKUException = createHttpError.BadRequest('Error.SKU.OutOfStock')

export const ProductNotFoundException = createHttpError.NotFound('Error.Product.NotFound')

export const NotFoundCartItemException = createHttpError.NotFound('Error.CartItem.NotFound')

export const InvalidQuantityException = createHttpError.BadRequest('Error.CartItem.InvalidQuantity')
