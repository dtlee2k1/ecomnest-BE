import { VariantsType } from 'src/routes/product/product.model'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace PrismaJson {
    type VariantsCustom = VariantsType
  }
}

export {}
