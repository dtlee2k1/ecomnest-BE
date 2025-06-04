import { ProductTranslationType } from 'src/shared/models/shared-product-translation.model'
import { VariantsType } from 'src/shared/models/shared-product.model'

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace PrismaJson {
    type VariantsCustom = VariantsType
    type ProductTranslations = Pick<ProductTranslationType, 'id' | 'name' | 'description' | 'languageId'>[]
    type Receiver = {
      name: string
      phone: string
      address: string
    }
  }
}

export {}
