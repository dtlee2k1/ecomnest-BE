import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  CreateUserBodyDto,
  CreateUserResDto,
  GetUserParamsDto,
  GetUsersQueryDto,
  GetUsersResDto,
  UpdateUserBodyDto
} from 'src/routes/user/user.dto'
import { UserService } from 'src/routes/user/user.service'
import { ActiveRolePermissions } from 'src/shared/decorators/active-role-permissions.decorator'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import { GetUserProfileResDto, UpdateProfileResDto } from 'src/shared/dtos/shared-user.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ZodSerializerDto(GetUsersResDto)
  list(@Query() query: GetUsersQueryDto) {
    return this.userService.list({
      page: query.page,
      limit: query.limit
    })
  }

  @Get(':userId')
  @ZodSerializerDto(GetUserProfileResDto)
  findById(@Param() params: GetUserParamsDto) {
    return this.userService.findById(params.userId)
  }

  @Post()
  @ZodSerializerDto(CreateUserResDto)
  create(
    @Body() body: CreateUserBodyDto,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') roleName: string
  ) {
    return this.userService.create({
      data: body,
      createdById: userId,
      createdByRoleName: roleName
    })
  }

  @Put(':userId')
  @ZodSerializerDto(UpdateProfileResDto)
  update(
    @Body() body: UpdateUserBodyDto,
    @Param() params: GetUserParamsDto,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') roleName: string
  ) {
    return this.userService.update({
      data: body,
      id: params.userId,
      updatedById: userId,
      updatedByRoleName: roleName
    })
  }

  @Delete(':userId')
  @ZodSerializerDto(MessageResDto)
  delete(
    @Param() params: GetUserParamsDto,
    @ActiveUser('userId') userId: number,
    @ActiveRolePermissions('name') roleName: string
  ) {
    return this.userService.delete({
      id: params.userId,
      deletedById: userId,
      deletedByRoleName: roleName
    })
  }
}
