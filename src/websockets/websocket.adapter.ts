import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { createClient } from 'redis'
import { ServerOptions, Server, Socket } from 'socket.io'
import { generateRoomUserId } from 'src/shared/helpers'
import { SharedWebsocketRepository } from 'src/shared/repositories/shared-websocket.repo'
import { TokenService } from 'src/shared/services/token.service'

export class WebsocketAdapter extends IoAdapter {
  private readonly sharedWebsocketRepository: SharedWebsocketRepository
  private readonly tokenService: TokenService
  private adapterConstructor: ReturnType<typeof createAdapter>

  constructor(app: INestApplicationContext) {
    super(app)
    this.sharedWebsocketRepository = app.get(SharedWebsocketRepository)
    this.tokenService = app.get(TokenService)
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: `redis://localhost:6379` })
    const subClient = pubClient.duplicate()

    await Promise.all([pubClient.connect(), subClient.connect()])

    this.adapterConstructor = createAdapter(pubClient, subClient)
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        credentials: true
      }
    })

    server.use((socket, next) => {
      this.authMiddleware(socket, next)
        .then(() => {})
        .catch(() => {})
    })
    server.of(/.*/).use((socket, next) => {
      this.authMiddleware(socket, next)
        .then(() => {})
        .catch(() => {})
    })

    return server
  }

  async authMiddleware(socket: Socket, next: (err?: any) => void) {
    const { authorization } = socket.handshake.headers
    if (!authorization) {
      return next(new Error('Missing Authorization header'))
    }
    const accessToken = authorization.split(' ')[1]
    if (!accessToken) {
      return next(new Error('Missing access token'))
    }
    try {
      const { userId } = await this.tokenService.verifyAccessToken(accessToken)
      await socket.join(generateRoomUserId(userId))
      // await this.sharedWebsocketRepository.create({
      //   id: socket.id,
      //   userId
      // })
      // socket.on('disconnect', async () => {
      //   console.log('disconnect', socket.id)
      //   await this.sharedWebsocketRepository.delete(socket.id).catch(() => {})
      // })
      next()
    } catch (error) {
      next(error)
    }
  }
}
