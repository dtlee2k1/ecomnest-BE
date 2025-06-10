import { Injectable } from '@nestjs/common'
import { WebhookPaymentBodyType } from 'src/routes/payment/payment.model'
import { PaymentProducer } from 'src/routes/payment/payment.producer'
import { PaymentRepo } from 'src/routes/payment/payment.repo'

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepo: PaymentRepo,
    private readonly paymentProducer: PaymentProducer
  ) {}

  async receiver(body: WebhookPaymentBodyType) {
    const { paymentId, message } = await this.paymentRepo.receiver(body)
    await this.paymentProducer.removeJob(paymentId) // Remove the job from the queue

    return {
      message
    }
  }
}
