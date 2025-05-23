import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateBrandTranslationBodyDto,
  GetBrandTranslationDetailResDto,
  GetBrandTranslationParamsDto,
  UpdateBrandTranslationBodyDto
} from 'src/routes/brand/brand-translation/brand-translation.dto'
import { BrandTranslationService } from 'src/routes/brand/brand-translation/brand-translation.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

@Controller('brand-translations')
export class BrandTranslationController {
  constructor(private readonly brandTranslationService: BrandTranslationService) {}

  @Get(':brandTranslationId')
  @ZodSerializerDto(GetBrandTranslationDetailResDto)
  findById(@Param() params: GetBrandTranslationParamsDto) {
    return this.brandTranslationService.findById(params.brandTranslationId)
  }

  @Post()
  @ZodSerializerDto(GetBrandTranslationDetailResDto)
  create(@Body() body: CreateBrandTranslationBodyDto, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':brandTranslationId')
  @ZodSerializerDto(GetBrandTranslationDetailResDto)
  update(
    @Body() body: UpdateBrandTranslationBodyDto,
    @Param() params: GetBrandTranslationParamsDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.brandTranslationService.update({
      data: body,
      id: params.brandTranslationId,
      updatedById: userId
    })
  }

  @Delete(':brandTranslationId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() params: GetBrandTranslationParamsDto, @ActiveUser('userId') userId: number) {
    return this.brandTranslationService.delete({
      id: params.brandTranslationId,
      deletedById: userId
    })
  }
}
