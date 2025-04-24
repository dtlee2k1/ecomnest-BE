import { SetMetadata } from '@nestjs/common'
import { AuthTypeTypes, ConditionGuard, ConditionGuardTypes } from 'src/shared/constants/auth.constant'

export const AUTH_TYPE_KEY = 'authType'
export type AuthTypeDecoratorPayload = {
  authTypes: AuthTypeTypes[]
  options: { condition: ConditionGuardTypes }
}

export function Auth(authTypes: AuthTypeTypes[], options?: { condition: ConditionGuardTypes | undefined }) {
  return SetMetadata(AUTH_TYPE_KEY, { authTypes, options: options ?? { condition: ConditionGuard.And } })
}
