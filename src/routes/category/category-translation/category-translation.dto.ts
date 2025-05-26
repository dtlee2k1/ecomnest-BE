import { createZodDto } from 'nestjs-zod'
import {
  CreateCategoryTranslationBodySchema,
  GetCategoryTranslationDetailResSchema,
  GetCategoryTranslationParamsSchema,
  UpdateCategoryTranslationBodySchema
} from 'src/routes/category/category-translation/category-translation.model'

export class GetCategoryTranslationDetailResDto extends createZodDto(GetCategoryTranslationDetailResSchema) {}

export class GetCategoryTranslationParamsDto extends createZodDto(GetCategoryTranslationParamsSchema) {}

export class CreateCategoryTranslationBodyDto extends createZodDto(CreateCategoryTranslationBodySchema) {}

export class UpdateCategoryTranslationBodyDto extends createZodDto(UpdateCategoryTranslationBodySchema) {}
