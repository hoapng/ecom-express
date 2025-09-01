import { CreateOrderBodyType, GetOrderListQueryType } from '~/models/order.model'
import { orderRepo, OrderRepo } from '~/repositories/order.repo'

export class OrderService {
  constructor(private readonly orderRepo: OrderRepo) {}

  async list(userId: number, query: GetOrderListQueryType) {
    return this.orderRepo.list(userId, query)
  }

  async create(userId: number, body: CreateOrderBodyType) {
    return this.orderRepo.create(userId, body)
  }

  cancel(userId: number, orderId: number) {
    return this.orderRepo.cancel(userId, orderId)
  }

  detail(userId: number, orderId: number) {
    return this.orderRepo.detail(userId, orderId)
  }
}

export const orderService = new OrderService(orderRepo)
