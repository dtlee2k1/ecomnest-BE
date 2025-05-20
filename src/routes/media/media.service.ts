import { Injectable } from '@nestjs/common'
import { S3Service } from 'src/shared/services/s3.service'
import { unlink } from 'fs/promises'
import { generateRandomFilename } from 'src/shared/helpers'
import { PresignedUploadFileBodyType } from 'src/routes/media/media.model'
@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}
  async uploadFile(files: Array<Express.Multer.File>) {
    const result = await Promise.all(
      files.map((file) => {
        return this.s3Service
          .uploadFile({
            filename: `images/${file.filename}`,
            filepath: file.path,
            ContentType: file.mimetype
          })
          .then((res) => {
            return {
              url: res.Location
            }
          })
      })
    )

    // Delete local files after uploading to S3
    await Promise.all(
      files.map(async (file) => {
        await unlink(file.path)
      })
    )
    console.log(result)
    return {
      data: result
    }
    // return files.map((file) => ({ url: `${envConfig.PREFIX_STATIC_ENDPOINT}/${file.filename}` }))
  }

  async getPresignedUrl(body: PresignedUploadFileBodyType) {
    const randomFilename = generateRandomFilename(body.filename)
    const presignedUrl = await this.s3Service.createPresignedUrlWithClient(randomFilename)
    const url = presignedUrl.split('?')[0]

    return {
      presignedUrl,
      url
    }
  }
}
