import { createZodDto } from 'nestjs-zod'
import {
  CreateLanguageBodySchema,
  GetLanguageDetailResSchema,
  GetLanguageParamsSchema,
  GetLanguagesResSchema,
  UpdateLanguageBodySchema
} from 'src/routes/language/language.model'

export class GetLanguagesResDto extends createZodDto(GetLanguagesResSchema) {}

export class GetLanguageParamsDto extends createZodDto(GetLanguageParamsSchema) {}

export class GetLanguageDetailResDto extends createZodDto(GetLanguageDetailResSchema) {}

export class CreateLanguageBodyDto extends createZodDto(CreateLanguageBodySchema) {}

export class UpdateLanguageBodyDto extends createZodDto(UpdateLanguageBodySchema) {}
