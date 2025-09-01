import { NextFunction, Request, Response } from 'express'
import { REQUEST_USER_KEY } from '~/constants/auth.constant'
import {
  CreateOrderBodySchema,
  CreateOrderResSchema,
  GetOrderListQuerySchema,
  GetOrderListResSchema
} from '~/models/order.model'
import { orderService, OrderService } from '~/services/order.service'

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async getCart(req: Request, res: Response, next: NextFunction) {
    const query = GetOrderListQuerySchema.parse(req.query)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.orderService.list(userId, query)
    req.data = GetOrderListResSchema.parse(data)
    return next()
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const body = CreateOrderBodySchema.parse(req.body)
    const userId = req[REQUEST_USER_KEY]?.userId as number
    const data = await this.orderService.create(userId, body)
    req.data = CreateOrderResSchema.parse(data)
    return next()
  }
}

export const orderController = new OrderController(orderService)
