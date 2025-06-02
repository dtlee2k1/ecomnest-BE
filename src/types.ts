import { VariantsType } from 'src/shared/models/shared-product.model'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace PrismaJson {
    type VariantsCustom = VariantsType
  }
}

export {}
