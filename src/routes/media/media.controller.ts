import {
  Body,
  Controller,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import path from 'path'
import { UPLOAD_DIR } from 'src/shared/constants/other.constant'
import { Response } from 'express'
import { MediaService } from 'src/routes/media/media.service'
import { ParseFilePipeWithUnlink } from 'src/routes/media/parse-file-pipe-with-unlink.pipe'
import { ZodSerializerDto } from 'nestjs-zod'
import { PresignedUploadFileBodyDto, PresignedUploadFileResDto, UploadFilesResDto } from 'src/routes/media/media.dto'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images/upload')
  @ZodSerializerDto(UploadFilesResDto)
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
      }
    })
  )
  uploadFile(
    @UploadedFiles(
      new ParseFilePipeWithUnlink({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }) // 5MB
        ]
      })
    )
    files: Array<Express.Multer.File>
  ) {
    return this.mediaService.uploadFile(files)
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

  @Post('images/upload/presigned-url')
  @IsPublic()
  @ZodSerializerDto(PresignedUploadFileResDto)
  async createPresignedUrl(@Body() body: PresignedUploadFileBodyDto) {
    return this.mediaService.getPresignedUrl(body)
  }
}
