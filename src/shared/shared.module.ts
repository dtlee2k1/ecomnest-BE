import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { PaymentAPIKeyGuard } from 'src/shared/guards/payment-api-key.guard'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { SharedRoleRepository } from 'src/shared/repositories/shared-role.repo'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { TwoFactorService } from 'src/shared/services/2fa.service'
import { EmailService } from 'src/shared/services/email.service'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { S3Service } from 'src/shared/services/s3.service'
import { TokenService } from 'src/shared/services/token.service'
import { SharedPaymentRepository } from 'src/shared/repositories/shared-payment.repo'
import { SharedWebsocketRepository } from 'src/shared/repositories/shared-websocket.repo'

const shareServices = [
  PrismaService,
  HashingService,
  TokenService,
  SharedUserRepository,
  EmailService,
  TwoFactorService,
  SharedRoleRepository,
  S3Service,
  SharedPaymentRepository,
  SharedWebsocketRepository
]

@Global()
@Module({
  providers: [
    ...shareServices,
    AccessTokenGuard,
    PaymentAPIKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    }
  ],
  exports: shareServices,
  imports: [JwtModule]
})
export class SharedModule {}
