import { Body, Controller, Post } from '@nestjs/common'
import { PaymentService } from './payment.service'
import { ZodSerializerDto } from 'nestjs-zod'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { WebhookPaymentBodyDto } from 'src/routes/payment/payment.dto'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/receiver')
  @ZodSerializerDto(MessageResDto)
  @Auth(['PaymentAPIKey'])
  receiver(@Body() body: WebhookPaymentBodyDto) {
    return this.paymentService.receiver(body)
  }
}
