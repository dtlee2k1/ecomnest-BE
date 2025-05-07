import { createZodDto } from 'nestjs-zod'
import {
  ForgotPasswordBodySchema,
  GetAuthorizationUrlResSchema,
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  RefreshTokenBodySchema,
  RefreshTokenResSchema,
  RegisterBodySchema,
  RegisterResSchema,
  SendOTPBodySchema
} from 'src/routes/auth/auth.model'

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class RegisterResDto extends createZodDto(RegisterResSchema) {}

export class SendOTPBodyDto extends createZodDto(SendOTPBodySchema) {}

export class LoginBodyDto extends createZodDto(LoginBodySchema) {}

export class LoginResDto extends createZodDto(LoginResSchema) {}

export class RefreshTokenBodyDto extends createZodDto(RefreshTokenBodySchema) {}

export class RefreshTokenResDto extends createZodDto(RefreshTokenResSchema) {}

export class LogoutBodyDto extends createZodDto(LogoutBodySchema) {}

export class GetAuthorizationUrlResDto extends createZodDto(GetAuthorizationUrlResSchema) {}

export class ForgotPasswordBodyDto extends createZodDto(ForgotPasswordBodySchema) {}
