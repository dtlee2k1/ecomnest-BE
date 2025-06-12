import { Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { WebhookPaymentBodyType } from 'src/routes/payment/payment.model'
import { PaymentRepo } from 'src/routes/payment/payment.repo'
import { SharedWebsocketRepository } from 'src/shared/repositories/shared-websocket.repo'
import { Server } from 'socket.io'
import { generateRoomUserId } from 'src/shared/helpers'

@Injectable()
@WebSocketGateway({ namespace: 'payment' })
export class PaymentService {
  @WebSocketServer()
  server: Server
  constructor(
    private readonly paymentRepo: PaymentRepo,
    private readonly SharedWebsocketRepository: SharedWebsocketRepository
  ) {}

  async receiver(body: WebhookPaymentBodyType) {
    const userId = await this.paymentRepo.receiver(body)
    this.server.to(generateRoomUserId(userId)).emit('payment', {
      status: 'success'
    })

    // try {
    //   const websockets = await this.SharedWebsocketRepository.findMany(userId)
    //   websockets.forEach((ws) => {
    //     this.server.to(ws.id).emit('payment', {
    //       status: 'success'
    //     })
    //   })
    // } catch (error) {
    //   console.log(error)
    // }
    return {
      message: 'Payment successfully'
    }
  }
}
