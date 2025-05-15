import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { MediaController } from 'src/routes/media/media.controller'
import { generateRandomFilename } from 'src/shared/helpers'
import multer from 'multer'
import fs from 'fs'
import { UPLOAD_DIR } from 'src/shared/constants/other.constant'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const newFilename = generateRandomFilename(file.originalname)
    cb(null, newFilename)
  }
})

@Module({
  imports: [
    MulterModule.register({
      storage
    })
  ],
  controllers: [MediaController]
})
export class MediaModule {
  constructor() {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    }
  }
}
