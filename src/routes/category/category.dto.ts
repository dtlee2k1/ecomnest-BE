import { createZodDto } from 'nestjs-zod'
import {
  CreateCategoryBodySchema,
  GetCategoryDetailResSchema,
  GetCategoryParamsSchema,
  GetAllCategoriesResSchema,
  UpdateCategoryBodySchema,
  GetAllCategoriesQuerySchema
} from 'src/routes/category/category.model'

export class GetAllCategoriesResDto extends createZodDto(GetAllCategoriesResSchema) {}

export class GetAllCategoriesQueryDto extends createZodDto(GetAllCategoriesQuerySchema) {}

export class GetCategoryParamsDto extends createZodDto(GetCategoryParamsSchema) {}

export class GetCategoryDetailResDto extends createZodDto(GetCategoryDetailResSchema) {}

export class CreateCategoryBodyDto extends createZodDto(CreateCategoryBodySchema) {}

export class UpdateCategoryBodyDto extends createZodDto(UpdateCategoryBodySchema) {}
