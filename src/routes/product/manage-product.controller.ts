import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { ManageProductService } from 'src/routes/product/manage-product.service'
import {
  CreateProductBodyDto,
  GetManageProductsQueryDto,
  GetProductDetailResDto,
  GetProductParamsDto,
  GetProductsResDto,
  ProductDto,
  UpdateProductBodyDto
} from 'src/routes/product/product.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'

@Controller('manage-product/products')
export class ManageProductController {
  constructor(private readonly manageProductService: ManageProductService) {}

  @Get()
  @ZodSerializerDto(GetProductsResDto)
  list(@Query() query: GetManageProductsQueryDto, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.list({
      query,
      userIdRequest: user.userId,
      roleNameRequest: user.roleName
    })
  }

  @Get(':productId')
  @ZodSerializerDto(GetProductDetailResDto)
  findById(@Param() params: GetProductParamsDto, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.getDetail({
      productId: params.productId,
      userIdRequest: user.userId,
      roleNameRequest: user.roleName
    })
  }

  @Post()
  @ZodSerializerDto(GetProductDetailResDto)
  create(@Body() body: CreateProductBodyDto, @ActiveUser('userId') userId: number) {
    return this.manageProductService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':productId')
  @ZodSerializerDto(ProductDto)
  update(
    @Body() body: UpdateProductBodyDto,
    @Param() params: GetProductParamsDto,
    @ActiveUser() user: AccessTokenPayload
  ) {
    return this.manageProductService.update({
      data: body,
      productId: params.productId,
      updatedById: user.userId,
      roleNameRequest: user.roleName
    })
  }

  @Delete(':productId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() params: GetProductParamsDto, @ActiveUser() user: AccessTokenPayload) {
    return this.manageProductService.delete({
      productId: params.productId,
      deletedById: user.userId,
      roleNameRequest: user.roleName
    })
  }
}
