import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateProductBodyDto,
  GetProductDetailResDto,
  GetProductParamsDto,
  GetProductsQueryDto,
  GetProductsResDto,
  ProductDto,
  UpdateProductBodyDto
} from 'src/routes/product/product.dto'
import { ProductService } from 'src/routes/product/product.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetProductsResDto)
  list(@Query() query: GetProductsQueryDto) {
    return this.productService.list(query)
  }

  @Get(':productId')
  @IsPublic()
  @ZodSerializerDto(GetProductDetailResDto)
  findById(@Param() params: GetProductParamsDto) {
    return this.productService.findById(params.productId)
  }

  @Post()
  @ZodSerializerDto(GetProductDetailResDto)
  create(@Body() body: CreateProductBodyDto, @ActiveUser('userId') userId: number) {
    return this.productService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':productId')
  @ZodSerializerDto(ProductDto)
  update(
    @Body() body: UpdateProductBodyDto,
    @Param() params: GetProductParamsDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.productService.update({
      data: body,
      id: params.productId,
      updatedById: userId
    })
  }

  @Delete(':productId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() params: GetProductParamsDto, @ActiveUser('userId') userId: number) {
    return this.productService.delete({
      id: params.productId,
      deletedById: userId
    })
  }
}
