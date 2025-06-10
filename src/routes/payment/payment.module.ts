import { Module } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { PaymentRepo } from 'src/routes/payment/payment.repo'
import { PaymentProducer } from 'src/routes/payment/payment.producer'
import { BullModule } from '@nestjs/bullmq'
import { PAYMENT_QUEUE_NAME } from 'src/shared/constants/queue.constant'

@Module({
  imports: [
    BullModule.registerQueue({
      name: PAYMENT_QUEUE_NAME
    })
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepo, PaymentProducer]
})
export class PaymentModule {}
