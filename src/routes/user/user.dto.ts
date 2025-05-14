import { createZodDto } from 'nestjs-zod'
import {
  CreateUserBodySchema,
  GetUserParamsSchema,
  GetUsersQuerySchema,
  GetUsersResSchema,
  UpdateUserBodySchema
} from 'src/routes/user/user.model'
import { UpdateProfileResDto } from 'src/shared/dtos/shared-user.dto'

export class GetUsersResDto extends createZodDto(GetUsersResSchema) {}

export class GetUsersQueryDto extends createZodDto(GetUsersQuerySchema) {}

export class GetUserParamsDto extends createZodDto(GetUserParamsSchema) {}

export class CreateUserBodyDto extends createZodDto(CreateUserBodySchema) {}

export class UpdateUserBodyDto extends createZodDto(UpdateUserBodySchema) {}

export class CreateUserResDto extends UpdateProfileResDto {}
