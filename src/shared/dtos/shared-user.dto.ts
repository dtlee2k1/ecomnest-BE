import { createZodDto } from 'nestjs-zod'
import { GetUserProfileResSchema, UpdateProfileResSchema } from '../models/shared-user.model'

export class GetUserProfileResDto extends createZodDto(GetUserProfileResSchema) {}
export class UpdateProfileResDto extends createZodDto(UpdateProfileResSchema) {}
