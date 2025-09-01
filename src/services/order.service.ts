import { GetOrderListQueryType } from '~/models/order.model'
import { orderRepo, OrderRepo } from '~/repositories/order.repo'

export class OrderService {
  constructor(private readonly orderRepo: OrderRepo) {}

  async list(userId: number, query: GetOrderListQueryType) {
    return this.orderRepo.list(userId, query)
  }
}

export const orderService = new OrderService(orderRepo)
