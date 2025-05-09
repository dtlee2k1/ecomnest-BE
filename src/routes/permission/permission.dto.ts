import { createZodDto } from 'nestjs-zod'
import {
  CreatePermissionBodySchema,
  GetPermissionDetailResSchema,
  GetPermissionParamsSchema,
  GetPermissionsQuerySchema,
  GetPermissionsResSchema,
  UpdatePermissionBodySchema
} from 'src/routes/permission/permission.model'

export class GetPermissionsResDto extends createZodDto(GetPermissionsResSchema) {}

export class GetPermissionParamsDto extends createZodDto(GetPermissionParamsSchema) {}

export class GetPermissionDetailResDto extends createZodDto(GetPermissionDetailResSchema) {}

export class CreatePermissionBodyDto extends createZodDto(CreatePermissionBodySchema) {}

export class UpdatePermissionBodyDto extends createZodDto(UpdatePermissionBodySchema) {}

export class GetPermissionsQueryDto extends createZodDto(GetPermissionsQuerySchema) {}
