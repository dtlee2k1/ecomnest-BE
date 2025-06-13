import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WebsocketAdapter } from 'src/websockets/websocket.adapter'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.set('trust proxy', 'loopback') // Trust requests from the loopback address
  app.enableCors()
  app.use(helmet())
  const websocketAdapter = new WebsocketAdapter(app)
  await websocketAdapter.connectToRedis()
  app.useWebSocketAdapter(websocketAdapter)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
