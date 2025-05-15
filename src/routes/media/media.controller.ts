import {
  Controller,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import envConfig from 'src/shared/config'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import path from 'path'
import { UPLOAD_DIR } from 'src/shared/constants/other.constant'
import { Response } from 'express'

@Controller('media')
export class MediaController {
  constructor() {}

  @Post('images/upload')
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    })
  )
  uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }) // 5MB
        ]
      })
    )
    files: Array<Express.Multer.File>
  ) {
    return files.map((file) => ({ url: `${envConfig.PREFIX_STATIC_ENDPOINT}/${file.filename}` }))
  }

  @Get('static/:filename')
  @IsPublic()
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.resolve(UPLOAD_DIR, filename), (error) => {
      if (error) {
        res.status(HttpStatus.NOT_FOUND).json(new NotFoundException('File not found'))
      }
    })
  }
}
