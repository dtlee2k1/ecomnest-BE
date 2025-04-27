import { Injectable } from '@nestjs/common'
import { RegisterBodyType, VerificationCodeType } from 'src/routes/auth/auth.model'
import { TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    data: Omit<RegisterBodyType, 'confirmPassword' | 'code'> & Pick<UserType, 'roleId'>
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return await this.prismaService.user.create({
      data,
      omit: {
        password: true,
        totpSecret: true
      }
    })
  }

  async createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>
  ): Promise<VerificationCodeType> {
    return await this.prismaService.verificationCode.upsert({
      where: { email: payload.email },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt
      }
    })
  }

  async findUniqueVerificationCode(
    uniqueValue:
      | { email: string }
      | { id: number }
      | {
          email: string
          code: string
          type: TypeOfVerificationCodeType
        }
  ): Promise<VerificationCodeType | null> {
    return await this.prismaService.verificationCode.findUnique({ where: uniqueValue })
  }
}
