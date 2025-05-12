import { createZodDto } from 'nestjs-zod'
import {
  CreateRoleBodySchema,
  CreateRoleResSchema,
  GetRoleDetailResSchema,
  GetRoleParamsSchema,
  GetRolesQuerySchema,
  GetRolesResSchema,
  UpdateRoleBodySchema
} from 'src/routes/role/role.model'

export class GetRolesResDto extends createZodDto(GetRolesResSchema) {}

export class GetRoleParamsDto extends createZodDto(GetRoleParamsSchema) {}

export class GetRoleDetailResDto extends createZodDto(GetRoleDetailResSchema) {}

export class CreateRoleBodyDto extends createZodDto(CreateRoleBodySchema) {}

export class CreateRoleResDto extends createZodDto(CreateRoleResSchema) {}

export class UpdateRoleBodyDto extends createZodDto(UpdateRoleBodySchema) {}

export class GetRolesQueryDto extends createZodDto(GetRolesQuerySchema) {}
