import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateProductTranslationBodyDto,
  GetProductTranslationDetailResDto,
  GetProductTranslationParamsDto,
  UpdateProductTranslationBodyDto
} from 'src/routes/product/product-translation/product-translation.dto'
import { ProductTranslationService } from 'src/routes/product/product-translation/product-translation.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

@Controller('product-translations')
export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}

  @Get(':productTranslationId')
  @ZodSerializerDto(GetProductTranslationDetailResDto)
  findById(@Param() params: GetProductTranslationParamsDto) {
    return this.productTranslationService.findById(params.productTranslationId)
  }

  @Post()
  @ZodSerializerDto(GetProductTranslationDetailResDto)
  create(@Body() body: CreateProductTranslationBodyDto, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':productTranslationId')
  @ZodSerializerDto(GetProductTranslationDetailResDto)
  update(
    @Body() body: UpdateProductTranslationBodyDto,
    @Param() params: GetProductTranslationParamsDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.productTranslationService.update({
      data: body,
      id: params.productTranslationId,
      updatedById: userId
    })
  }

  @Delete(':productTranslationId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() params: GetProductTranslationParamsDto, @ActiveUser('userId') userId: number) {
    return this.productTranslationService.delete({
      id: params.productTranslationId,
      deletedById: userId
    })
  }
}
