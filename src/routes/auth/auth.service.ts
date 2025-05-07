import { HttpException, Injectable } from '@nestjs/common'
import { addMilliseconds } from 'date-fns'
import ms, { StringValue } from 'ms'
import {
  ForgotPasswordBodyType,
  LoginBodyType,
  RefreshTokenBodyType,
  RegisterBodyType,
  SendOTPBodyType
} from 'src/routes/auth/auth.model'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import {
  EmailAlreadyExistsException,
  EmailNotFoundException,
  FailedToSendOTPException,
  InvalidOTPException,
  InvalidPasswordException,
  OTPExpiredException,
  RefreshTokenAlreadyUsedException,
  UnauthorizedAccessException
} from 'src/routes/auth/error.model'
import { RolesService } from 'src/routes/auth/roles.service'
import envConfig from 'src/shared/config'
import { TypeOfVerificationCode, TypeOfVerificationCodeType } from 'src/shared/constants/auth.constant'
import { generateOTP, isRecordNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { EmailService } from 'src/shared/services/email.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly rolesService: RolesService,
    private readonly authRepository: AuthRepository,
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly emailService: EmailService
  ) {}
  async register(body: RegisterBodyType) {
    try {
      await this.validateVerificationCode({
        email: body.email,
        code: body.code,
        type: TypeOfVerificationCode.REGISTER
      })

      const clientRoleId = await this.rolesService.getClientRoleId()
      const hashedPassword = await this.hashingService.hashPassword(body.password)

      const data = {
        email: body.email,
        name: body.name,
        phoneNumber: body.phoneNumber,
        password: hashedPassword,
        roleId: clientRoleId
      }

      const [user] = await Promise.all([
        this.authRepository.createUser(data),
        this.authRepository.deleteVerificationCode({
          email: body.email,
          code: body.code,
          type: TypeOfVerificationCode.REGISTER
        })
      ])
      return user
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw EmailAlreadyExistsException
      }
      throw error
    }
  }

  async sendOTP(body: SendOTPBodyType) {
    const user = await this.sharedUserRepository.findUnique({ email: body.email })

    if (user && body.type === TypeOfVerificationCode.REGISTER) {
      throw EmailAlreadyExistsException
    }

    if (!user && body.type === TypeOfVerificationCode.FORGOT_PASSWORD) {
      throw EmailNotFoundException
    }

    const code = generateOTP()
    await this.authRepository.createVerificationCode({
      email: body.email,
      code,
      type: body.type,
      expiresAt: addMilliseconds(new Date(), ms(envConfig.OTP_EXPIRES_IN as StringValue))
    })

    const { error } = await this.emailService.sendOTP({ email: body.email, code })

    if (error) {
      throw FailedToSendOTPException
    }
    return {
      message: 'Send OTP successfully. Please check your email'
    }
  }

  async login(data: LoginBodyType & { userAgent: string; ip: string }) {
    const user = await this.authRepository.findUniqueUserIncludeRole({ email: data.email })

    if (!user) {
      throw EmailNotFoundException
    }

    const isPasswordMatch = await this.hashingService.comparePassword(data.password, user.password)
    if (!isPasswordMatch) {
      throw InvalidPasswordException
    }

    const device = await this.authRepository.createDevice({ userId: user.id, userAgent: data.userAgent, ip: data.ip })

    const tokens = await this.generateTokens({
      userId: user.id,
      deviceId: device.id,
      roleId: user.roleId,
      roleName: user.role.name
    })
    return tokens
  }

  async generateTokens(payload: { userId: number; deviceId: number; roleId: number; roleName: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken({
        userId: payload.userId
      })
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.authRepository.createRefreshToken({
      token: refreshToken,
      userId: payload.userId,
      deviceId: payload.deviceId,
      expiresAt: new Date(decodedRefreshToken.exp * 1000)
    })
    return { accessToken, refreshToken }
  }

  async refreshToken({ refreshToken, userAgent, ip }: RefreshTokenBodyType & { userAgent: string; ip: string }) {
    try {
      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)

      const refreshTokenInDb = await this.authRepository.findUniqueRefreshTokenIncludeUserRoleDevice({
        token: refreshToken
      })

      if (!refreshTokenInDb) {
        throw RefreshTokenAlreadyUsedException
      }

      const {
        deviceId,
        user: {
          roleId,
          role: { name: roleName }
        }
      } = refreshTokenInDb

      const $updateDevice = this.authRepository.updateDevice(deviceId, {
        userAgent,
        ip
      })

      const $deleteRefreshToken = this.authRepository.deleteRefreshToken({
        token: refreshToken
      })

      const $tokens = this.generateTokens({ userId, deviceId, roleId, roleName })

      const [, , tokens] = await Promise.all([$updateDevice, $deleteRefreshToken, $tokens])
      return tokens
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw UnauthorizedAccessException
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.tokenService.verifyRefreshToken(refreshToken)

      const deletedRefreshToken = await this.authRepository.deleteRefreshToken({
        token: refreshToken
      })

      await this.authRepository.updateDevice(deletedRefreshToken.deviceId, { isActive: false })

      return { message: 'Logout successfully' }
    } catch (error) {
      if (isRecordNotFoundPrismaError(error)) {
        throw RefreshTokenAlreadyUsedException
      }
      throw UnauthorizedAccessException
    }
  }

  async forgotPassword(body: ForgotPasswordBodyType) {
    const { email, code, newPassword } = body

    const user = await this.sharedUserRepository.findUnique({ email })
    if (!user) {
      throw EmailNotFoundException
    }

    await this.validateVerificationCode({
      email,
      code,
      type: TypeOfVerificationCode.FORGOT_PASSWORD
    })

    const hashedPassword = await this.hashingService.hashPassword(newPassword)

    await Promise.all([
      this.authRepository.updateUser({ id: user.id }, { password: hashedPassword }),
      this.authRepository.deleteVerificationCode({
        email,
        code,
        type: TypeOfVerificationCode.FORGOT_PASSWORD
      })
    ])

    return {
      message: 'Reset password successfully'
    }
  }

  async validateVerificationCode({
    email,
    code,
    type
  }: {
    email: string
    code: string
    type: TypeOfVerificationCodeType
  }) {
    const verificationCode = await this.authRepository.findUniqueVerificationCode({
      email,
      code,
      type
    })

    if (!verificationCode) {
      throw InvalidOTPException
    }

    if (verificationCode.expiresAt < new Date()) {
      throw OTPExpiredException
    }

    return verificationCode
  }
}
