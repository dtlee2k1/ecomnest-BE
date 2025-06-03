import { createZodDto } from 'nestjs-zod'
import {
  AddToCartBodySchema,
  CartItemSchema,
  DeleteCartBodySchema,
  GetCartItemParamsSchema,
  GetCartResSchema,
  UpdateCartItemBodySchema
} from 'src/routes/cart/cart.model'

export class CartItemDto extends createZodDto(CartItemSchema) {}

export class GetCartItemParamsDto extends createZodDto(GetCartItemParamsSchema) {}

export class GetCartResDto extends createZodDto(GetCartResSchema) {}

export class AddToCartBodyDto extends createZodDto(AddToCartBodySchema) {}

export class UpdateCartItemBodyDto extends createZodDto(UpdateCartItemBodySchema) {}

export class DeleteCartBodyDto extends createZodDto(DeleteCartBodySchema) {}
