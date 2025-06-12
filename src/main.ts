import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { WebsocketAdapter } from 'src/websockets/websocket.adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const websocketAdapter = new WebsocketAdapter(app)
  await websocketAdapter.connectToRedis()
  app.useWebSocketAdapter(websocketAdapter)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
