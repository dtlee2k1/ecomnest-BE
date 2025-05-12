import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateRoleBodyDto,
  CreateRoleResDto,
  GetRoleDetailResDto,
  GetRoleParamsDto,
  GetRolesQueryDto,
  GetRolesResDto,
  UpdateRoleBodyDto
} from 'src/routes/role/role.dto'
import { RoleService } from 'src/routes/role/role.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ZodSerializerDto(GetRolesResDto)
  list(@Query() query: GetRolesQueryDto) {
    return this.roleService.list({
      page: query.page,
      limit: query.limit
    })
  }

  @Get(':roleId')
  @ZodSerializerDto(GetRoleDetailResDto)
  findById(@Param() params: GetRoleParamsDto) {
    return this.roleService.findById(params.roleId)
  }

  @Post()
  @ZodSerializerDto(CreateRoleResDto)
  create(@Body() body: CreateRoleBodyDto, @ActiveUser('userId') userId: number) {
    return this.roleService.create({
      data: body,
      createdById: userId
    })
  }

  @Put(':roleId')
  @ZodSerializerDto(GetRoleDetailResDto)
  update(@Body() body: UpdateRoleBodyDto, @Param() params: GetRoleParamsDto, @ActiveUser('userId') userId: number) {
    return this.roleService.update({
      data: body,
      id: params.roleId,
      updatedById: userId
    })
  }

  @Delete(':roleId')
  @ZodSerializerDto(MessageResDto)
  delete(@Param() params: GetRoleParamsDto, @ActiveUser('userId') userId: number) {
    return this.roleService.delete({
      id: params.roleId,
      deletedById: userId
    })
  }
}
