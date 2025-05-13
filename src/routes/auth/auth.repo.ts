import { Injectable } from '@nestjs/common'
import { DeviceType, RefreshTokenType, VerificationCodeType } from 'src/routes/auth/auth.model'
import { TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant'
import { RoleType } from 'src/shared/models/shared-role.model'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    data: Pick<UserType, 'roleId' | 'email' | 'name' | 'password' | 'phoneNumber'>
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return await this.prismaService.user.create({
      data,
      omit: {
        password: true,
        totpSecret: true
      }
    })
  }

  async createUserIncludeRole(
    data: Pick<UserType, 'roleId' | 'email' | 'name' | 'password' | 'phoneNumber' | 'avatar'>
  ): Promise<UserType & { role: RoleType }> {
    return await this.prismaService.user.create({
      data,
      include: {
        role: true
      }
    })
  }

  async createVerificationCode(
    payload: Pick<VerificationCodeType, 'email' | 'code' | 'type' | 'expiresAt'>
  ): Promise<VerificationCodeType> {
    return await this.prismaService.verificationCode.upsert({
      where: {
        email_code_type: {
          email: payload.email,
          code: payload.code,
          type: payload.type
        }
      },
      create: payload,
      update: {
        code: payload.code,
        expiresAt: payload.expiresAt
      }
    })
  }

  async findUniqueVerificationCode(
    uniqueValue:
      | { id: number }
      | {
          email_code_type: {
            email: string
            code: string
            type: TypeOfVerificationCodeType
          }
        }
  ): Promise<VerificationCodeType | null> {
    return await this.prismaService.verificationCode.findUnique({ where: uniqueValue })
  }

  async createRefreshToken(data: { token: string; userId: number; expiresAt: Date; deviceId: number }) {
    await this.prismaService.refreshToken.create({
      data
    })
  }

  async createDevice(
    data: Pick<DeviceType, 'userId' | 'userAgent' | 'ip'> & Partial<Pick<DeviceType, 'lastActive' | 'isActive'>>
  ) {
    return await this.prismaService.device.create({ data })
  }

  async findUniqueUserIncludeRole(
    uniqueObject: { email: string } | { id: number }
  ): Promise<(UserType & { role: RoleType }) | null> {
    return await this.prismaService.user.findUnique({
      where: uniqueObject,
      include: {
        role: true
      }
    })
  }

  async findUniqueRefreshTokenIncludeUserRoleDevice(uniqueObject: {
    token: string
  }): Promise<(RefreshTokenType & { user: UserType & { role: RoleType }; device: DeviceType }) | null> {
    return await this.prismaService.refreshToken.findUnique({
      where: uniqueObject,
      include: {
        user: {
          include: {
            role: true
          }
        },
        device: true
      }
    })
  }

  async updateDevice(deviceId: number, data: Partial<DeviceType>) {
    return await this.prismaService.device.update({
      where: {
        id: deviceId
      },
      data
    })
  }

  async deleteRefreshToken(uniqueObject: { token: string }) {
    return await this.prismaService.refreshToken.delete({
      where: uniqueObject
    })
  }

  async updateUser(where: { id: number } | { email: string }, data: Partial<Omit<UserType, 'id'>>): Promise<UserType> {
    return await this.prismaService.user.update({
      where,
      data
    })
  }

  async deleteVerificationCode(
    uniqueValue:
      | { id: number }
      | {
          email_code_type: {
            email: string
            code: string
            type: TypeOfVerificationCodeType
          }
        }
  ): Promise<VerificationCodeType> {
    return await this.prismaService.verificationCode.delete({
      where: uniqueValue
    })
  }
}
