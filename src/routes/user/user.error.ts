import { ForbiddenException, UnprocessableEntityException } from '@nestjs/common'

export const UserAlreadyExistsException = new UnprocessableEntityException([
  {
    message: 'Error.UserAlreadyExists',
    path: 'email'
  }
])

export const CannotUpdateAdminUserException = new ForbiddenException('Error.CannotUpdateAdminUser')

export const CannotDeleteAdminUserException = new ForbiddenException('Error.CannotDeleteAdminUser')

export const CannotSetAdminRoleToUserException = new ForbiddenException('Error.CannotSetAdminRoleToUser') // Only admin can set ADMIN role

export const RoleNotFoundException = new UnprocessableEntityException([
  {
    message: 'Error.RoleNotFound',
    path: 'roleId'
  }
])

export const CannotUpdateOrDeleteYourselfException = new ForbiddenException('Error.CannotUpdateOrDeleteYourself')
