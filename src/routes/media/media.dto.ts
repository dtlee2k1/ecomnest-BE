import { createZodDto } from 'nestjs-zod'
import {
  PresignedUploadFileBodySchema,
  PresignedUploadFileResSchema,
  UploadFilesResSchema
} from 'src/routes/media/media.model'

export class PresignedUploadFileBodyDto extends createZodDto(PresignedUploadFileBodySchema) {}

export class UploadFilesResDto extends createZodDto(UploadFilesResSchema) {}

export class PresignedUploadFileResDto extends createZodDto(PresignedUploadFileResSchema) {}
