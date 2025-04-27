import { createZodDto } from 'nestjs-zod'
import { RegisterBodySchema, RegisterResSchema, SendOTPBodySchema } from 'src/routes/auth/auth.model'

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}

export class RegisterResDto extends createZodDto(RegisterResSchema) {}

export class SendOTPBodyDto extends createZodDto(SendOTPBodySchema) {}
