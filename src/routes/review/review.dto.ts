import { createZodDto } from 'nestjs-zod'
import {
  CreateReviewBodySchema,
  CreateReviewResSchema,
  GetReviewDetailParamsSchema,
  GetReviewsParamsSchema,
  GetReviewsSchema,
  UpdateReviewBodySchema,
  UpdateReviewResSchema
} from 'src/routes/review/review.model'

export class GetReviewsDto extends createZodDto(GetReviewsSchema) {}
export class CreateReviewBodyDto extends createZodDto(CreateReviewBodySchema) {}
export class CreateReviewResDto extends createZodDto(CreateReviewResSchema) {}
export class UpdateReviewBodyDto extends createZodDto(UpdateReviewBodySchema) {}
export class UpdateReviewResDto extends createZodDto(UpdateReviewResSchema) {}
export class GetReviewsParamsDto extends createZodDto(GetReviewsParamsSchema) {}
export class GetReviewDetailParamsDto extends createZodDto(GetReviewDetailParamsSchema) {}
