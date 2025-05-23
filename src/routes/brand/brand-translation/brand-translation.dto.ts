import { createZodDto } from 'nestjs-zod'

import {
  CreateBrandTranslationBodySchema,
  GetBrandTranslationDetailResSchema,
  GetBrandTranslationParamsSchema,
  UpdateBrandTranslationBodySchema
} from 'src/routes/brand/brand-translation/brand-translation.model'

export class GetBrandTranslationDetailResDto extends createZodDto(GetBrandTranslationDetailResSchema) {}

export class GetBrandTranslationParamsDto extends createZodDto(GetBrandTranslationParamsSchema) {}

export class CreateBrandTranslationBodyDto extends createZodDto(CreateBrandTranslationBodySchema) {}

export class UpdateBrandTranslationBodyDto extends createZodDto(UpdateBrandTranslationBodySchema) {}
