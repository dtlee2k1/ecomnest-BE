import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'

const CustomValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) =>
    new UnprocessableEntityException(
      error.errors.map((error) => {
        return {
          ...error,
          path: error.path.join('.')
        }
      })
    )
})
export default CustomValidationPipe
