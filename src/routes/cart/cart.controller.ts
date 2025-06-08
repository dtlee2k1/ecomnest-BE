import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common'
import { CartService } from './cart.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import {
  AddToCartBodyDto,
  CartItemDto,
  DeleteCartBodyDto,
  GetCartItemParamsDto,
  GetCartResDto,
  UpdateCartItemBodyDto
} from 'src/routes/cart/cart.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { PaginationQueryDto } from 'src/shared/dtos/request.dto'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ZodSerializerDto(GetCartResDto)
  getCart(@ActiveUser('userId') userId: number, @Query() query: PaginationQueryDto) {
    return this.cartService.getCart(userId, query)
  }

  @Post()
  @ZodSerializerDto(CartItemDto)
  addToCart(@Body() body: AddToCartBodyDto, @ActiveUser('userId') userId: number) {
    return this.cartService.addToCart(userId, body)
  }

  @Put(':cartItemId')
  @ZodSerializerDto(CartItemDto)
  updateCartItem(
    @ActiveUser('userId') userId: number,
    @Param() param: GetCartItemParamsDto,
    @Body() body: UpdateCartItemBodyDto
  ) {
    return this.cartService.updateCartItem({
      userId,
      cartItemId: param.cartItemId,
      body
    })
  }

  @Post('delete')
  @ZodSerializerDto(MessageResDto)
  deleteCart(@Body() body: DeleteCartBodyDto, @ActiveUser('userId') userId: number) {
    return this.cartService.deleteCart(userId, body)
  }
}
