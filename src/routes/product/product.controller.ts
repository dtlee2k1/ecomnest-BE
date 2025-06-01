import { Controller, Get, Param, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  GetProductDetailResDto,
  GetProductParamsDto,
  GetProductsQueryDto,
  GetProductsResDto
} from 'src/routes/product/product.dto'
import { ProductService } from 'src/routes/product/product.service'

import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('products')
@IsPublic()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ZodSerializerDto(GetProductsResDto)
  list(@Query() query: GetProductsQueryDto) {
    return this.productService.list({ query })
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDto)
  findById(@Param() params: GetProductParamsDto) {
    return this.productService.getDetail({ productId: params.productId })
  }
}
