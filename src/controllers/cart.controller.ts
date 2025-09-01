import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import {
  AddToCartBodySchema,
  CartItemSchema,
  DeleteCartBodySchema,
  GetCartItemParamsSchema,
  GetCartResSchema,
  UpdateCartItemBodySchema
} from '~/models/cart.model'
import { PaginationQuerySchema } from '~/models/request.model'
import { MessageResSchema } from '~/models/response.model'
import { cartService, CartService } from '~/services/cart.service'

export class CartController {
  constructor(private readonly cartService: CartService) {}

  async getCart(req: Request, res: Response, next: NextFunction) {
    const lang = req.getLocale()
    const query = PaginationQuerySchema.parse(req.query)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.cartService.getCart(userId, query, lang)
    req.data = GetCartResSchema.parse(data)
    return next()
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    const body = AddToCartBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.cartService.addToCart(userId, body)
    req.data = CartItemSchema.parse(data)
    return next()
  }

  async updateCartItem(req: Request, res: Response, next: NextFunction) {
    const params = GetCartItemParamsSchema.parse(req.params)
    const body = UpdateCartItemBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.cartService.updateCartItem({
      userId,
      body,
      cartItemId: params.cartItemId
    })
    req.data = CartItemSchema.parse(data)
    return next()
  }

  async deleteCart(req: Request, res: Response, next: NextFunction) {
    const body = DeleteCartBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.cartService.deleteCart(userId, body)
    req.data = MessageResSchema.parse(data)
    return next()
  }
}

export const cartController = new CartController(cartService)
