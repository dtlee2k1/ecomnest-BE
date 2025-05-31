import { createZodDto } from 'nestjs-zod'
import {
  CreateProductTranslationBodySchema,
  GetProductTranslationDetailResSchema,
  GetProductTranslationParamsSchema,
  UpdateProductTranslationBodySchema
} from 'src/routes/product/product-translation/product-translation.model'

export class GetProductTranslationDetailResDto extends createZodDto(GetProductTranslationDetailResSchema) {}

export class GetProductTranslationParamsDto extends createZodDto(GetProductTranslationParamsSchema) {}

export class CreateProductTranslationBodyDto extends createZodDto(CreateProductTranslationBodySchema) {}

export class UpdateProductTranslationBodyDto extends createZodDto(UpdateProductTranslationBodySchema) {}
