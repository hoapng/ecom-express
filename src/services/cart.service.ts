import { AddToCartBodyType, DeleteCartBodyType, UpdateCartItemBodyType } from '~/models/cart.model'
import { PaginationQueryType } from '~/models/request.model'
import { cartRepo, CartRepo } from '~/repositories/cart.repo'

export class CartService {
  constructor(private readonly cartRepo: CartRepo) {}

  getCart(userId: number, query: PaginationQueryType, lang: string) {
    return this.cartRepo.list({
      userId,
      languageId: lang,
      page: query.page,
      limit: query.limit
    })
  }

  addToCart(userId: number, body: AddToCartBodyType) {
    return this.cartRepo.create(userId, body)
  }

  updateCartItem(cartItemId: number, body: UpdateCartItemBodyType) {
    return this.cartRepo.update(cartItemId, body)
  }

  async deleteCart(userId: number, body: DeleteCartBodyType) {
    const { count } = await this.cartRepo.delete(userId, body)
    return {
      message: `${count} item(s) deleted from cart`
    }
  }
}

export const cartService = new CartService(cartRepo)
