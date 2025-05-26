import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateCategoryBodyDto,
  GetCategoryDetailResDto,
  GetCategoryParamsDto,
  GetAllCategoriesResDto,
  UpdateCategoryBodyDto,
  GetAllCategoriesQueryDto
} from 'src/routes/category/category.dto'
import { CategoryService } from 'src/routes/category/category.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @IsPublic()
  @ZodSerializerDto(GetAllCategoriesResDto)
  findAll(@Query() query: GetAllCategoriesQueryDto) {
    return this.categoryService.findAll(query.parentCategoryId)
  }

  @Get(':categoryId')
  @IsPublic()
  @ZodSerializerDto(GetCategoryDetailResDto)
  findById(@Param() params: GetCategoryParamsDto) {
    return this.categoryService.findById(params.categoryId)
  }

  @Post()
  @ZodSerializerDto(GetCategoryDetailResDto)
  create(@Body() body: CreateCategoryBodyDto, @ActiveUser('userId') userId: number) {
    return this.categoryService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':categoryId')
  @ZodSerializerDto(GetCategoryDetailResDto)
  update(
    @Body() body: UpdateCategoryBodyDto,
    @Param() params: GetCategoryParamsDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.categoryService.update({
      data: body,
      id: params.categoryId,
      updatedById: userId
    })
  }

  @Delete(':categoryId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() params: GetCategoryParamsDto, @ActiveUser('userId') userId: number) {
    return this.categoryService.delete({
      id: params.categoryId,
      deletedById: userId
    })
  }
}
