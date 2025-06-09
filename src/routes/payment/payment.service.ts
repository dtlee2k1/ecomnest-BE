import { Injectable } from '@nestjs/common'
import { WebhookPaymentBodyType } from 'src/routes/payment/payment.model'
import { PaymentRepo } from 'src/routes/payment/payment.repo'

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepo) {}

  receiver(body: WebhookPaymentBodyType) {
    return this.paymentRepo.receiver(body)
  }
}
