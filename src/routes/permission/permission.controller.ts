import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreatePermissionBodyDto,
  GetPermissionDetailResDto,
  GetPermissionParamsDto,
  GetPermissionsQueryDto,
  GetPermissionsResDto,
  UpdatePermissionBodyDto
} from 'src/routes/permission/permission.dto'
import { PermissionService } from 'src/routes/permission/permission.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodSerializerDto(GetPermissionsResDto)
  list(@Query() query: GetPermissionsQueryDto) {
    return this.permissionService.list({
      page: query.page || 1,
      limit: query.limit || 10
    })
  }

  @Get(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDto)
  findById(@Param() params: GetPermissionParamsDto) {
    return this.permissionService.findById(params.permissionId)
  }

  @Post()
  @ZodSerializerDto(GetPermissionDetailResDto)
  create(@Body() body: CreatePermissionBodyDto, @ActiveUser('userId') userId: number) {
    return this.permissionService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':permissionId')
  @ZodSerializerDto(GetPermissionDetailResDto)
  update(
    @Body() body: UpdatePermissionBodyDto,
    @Param() params: GetPermissionParamsDto,
    @ActiveUser('userId') userId: number
  ) {
    return this.permissionService.update({
      data: body,
      id: params.permissionId,
      updatedById: userId
    })
  }

  @Delete(':permissionId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() params: GetPermissionParamsDto, @ActiveUser('userId') userId: number) {
    return this.permissionService.delete({
      id: params.permissionId,
      deletedById: userId
    })
  }
}
