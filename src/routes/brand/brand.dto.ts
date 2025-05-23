import { createZodDto } from 'nestjs-zod'
import {
  CreateBrandBodySchema,
  GetBrandDetailResSchema,
  GetBrandParamsSchema,
  GetBrandsResSchema,
  UpdateBrandBodySchema
} from 'src/routes/brand/brand.model'

export class GetBrandsResDto extends createZodDto(GetBrandsResSchema) {}

export class GetBrandParamsDto extends createZodDto(GetBrandParamsSchema) {}

export class GetBrandDetailResDto extends createZodDto(GetBrandDetailResSchema) {}

export class CreateBrandBodyDto extends createZodDto(CreateBrandBodySchema) {}

export class UpdateBrandBodyDto extends createZodDto(UpdateBrandBodySchema) {}
