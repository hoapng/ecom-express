import createHttpError from 'http-errors'

export const OrderNotFoundException = createHttpError.NotFound('Error.OrderNotFound')
export const ProductNotFoundException = createHttpError.NotFound('Error.ProductNotFound')
export const OutOfStockSKUException = createHttpError.BadRequest('Error.OutOfStockSKU')
export const NotFoundCartItemException = createHttpError.NotFound('Error.NotFoundCartItem')
export const SKUNotBelongToShopException = createHttpError.BadRequest('Error.SKUNotBelongToShop')
