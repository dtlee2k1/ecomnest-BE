import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { addMilliseconds } from 'date-fns'
import ms, { StringValue } from 'ms'
import { RegisterBodyType, SendOTPBodyType } from 'src/routes/auth/auth.model'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { RolesService } from 'src/routes/auth/roles.service'
import envConfig from 'src/shared/config'
import { TypeOfVerificationCode } from 'src/shared/constants/auth.constant'
import { generateOTP, isRecordNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository
  ) {}
  async register(body: RegisterBodyType) {
    try {
      const verificationCode = await this.authRepository.findUniqueVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.REGISTER
      })

      if (!verificationCode) {
        throw new UnprocessableEntityException([
          {
            path: 'code',
            message: 'OTP code is invalid'
          }
        ])
      }

      if (verificationCode.expiresAt < new Date()) {
        throw new UnprocessableEntityException([
          {
            path: 'code',
            message: 'OTP code is expired'
          }
        ])
      }

      const clientRoleId = await this.rolesService.getClientRoleId()
      const hashedPassword = await this.hashingService.hashPassword(body.password)

      const data = {
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId
      }
      return await this.authRepository.createUser(data)
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new UnprocessableEntityException([
          {
            path: 'email',
            message: 'Email is already exist'
          }
        ])
      }
      throw error
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({ email: body.email })

    if (user) {
      throw new UnprocessableEntityException([
        {
          path: 'email',
          message: 'Email is already exist'
        }
      ])
    }

    const code = generateOTP()
    const verificationCode = await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue))
    })

    return verificationCode
  }

  async login(body: any) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email
      }
    })

    if (!user) {
      throw new UnauthorizedException('Account is not exist')
    }

    const isPasswordMatch = await this.hashingService.comparePassword(body.password, user.password)
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect'
        }
      ])
    }
    const tokens = await this.generateTokens({ userId: user.id })
    return tokens
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload)
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000)
      }
    })
    return { accessToken, refreshToken }
  }

  async refreshToken(refreshToken: string) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken
        }
      })
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken
        }
      })
      return await this.generateTokens({ userId })
    } catch (error) {
      if (isRecordNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked')
      }
      throw new UnauthorizedException()
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken)
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken
        }
      })
      return { message: 'Logout successfully' }
    } catch (error) {
      if (isRecordNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked')
      }
      throw new UnauthorizedException()
    }
  }
}
