import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.model'
import { SKUSchema, UpsertSKUBodySchema } from 'src/routes/product/sku.model'
import { BrandIncludeTranslationSchema } from 'src/shared/models/shared-brand.model'
import { CategoryIncludeTranslationSchema } from 'src/shared/models/shared-category.model'
import { z } from 'zod'

function generateSKUs(variants: VariantsType) {
  function getCombinations(arrays: string[][]): string[] {
    return arrays.reduce((acc, curr) => acc.flatMap((x) => curr.map((y) => `${x}${x ? '-' : ''}${y}`)), [''])
  }

  const options = variants.map((variant) => variant.options)

  const combinations = getCombinations(options)

  return combinations.map((value) => ({
    value,
    price: 0,
    stock: 100,
    image: ''
  }))
}

export const VariantSchema = z.object({
  value: z.string(),
  options: z.array(z.string())
})

export const VariantsSchema = z.array(VariantSchema).superRefine((variants, ctx) => {
  // Check for duplicate variants and variant options
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i]
    const isDuplicateValue = variants.findIndex((v) => v.value === variant.value) !== i
    if (!isDuplicateValue) {
      return ctx.addIssue({
        code: 'custom',
        message: `The value ${variant.value} already exists in the variants list. Please check again.`,
        path: ['variants']
      })
    }
    const hasDuplicateOptions = new Set(variant.options).size !== variant.options.length
    if (hasDuplicateOptions) {
      return ctx.addIssue({
        code: 'custom',
        message: `Variant ${variant.value} contains duplicate option names. Please check again.`,
        path: ['variants']
      })
    }
  }
})

export const ProductSchema = z.object({
  id: z.number(),
  publishedAt: z.coerce.date().nullable(), // convert string to ISO date
  name: z.string().max(500),
  basePrice: z.number().positive(),
  virtualPrice: z.number().positive(),
  brandId: z.number().positive(),
  images: z.array(z.string()),
  variants: VariantsSchema, // Json field represented as a record

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const GetProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  name: z.string().optional(),
  brandIds: z.array(z.coerce.number().int().positive()).optional(),
  categories: z.array(z.coerce.number().int().positive()).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional()
})

export const GetProductsResSchema = z.object({
  data: z.array(
    ProductSchema.extend({
      productTranslations: z.array(ProductTranslationSchema)
    })
  ),
  totalItems: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number()
})

export const GetProductParamsSchema = z
  .object({
    productId: z.coerce.number().int().positive()
  })
  .strict()

export const GetProductDetailResSchema = ProductSchema.extend({
  productTranslations: z.array(ProductTranslationSchema),
  skus: z.array(SKUSchema),
  categories: z.array(CategoryIncludeTranslationSchema),
  brand: BrandIncludeTranslationSchema
})

export const CreateProductBodySchema = ProductSchema.pick({
  publishedAt: true,
  name: true,
  basePrice: true,
  virtualPrice: true,
  brandId: true,
  images: true,
  variants: true
})
  .extend({
    categories: z.array(z.coerce.number().int().positive()),
    skus: z.array(UpsertSKUBodySchema)
  })
  .strict()
  .superRefine(({ variants, skus }, ctx) => {
    // Check if the number of SKUs is valid
    const skuValueArray = generateSKUs(variants)
    if (skus.length !== skuValueArray.length) {
      return ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: `The number of SKUs should be ${skuValueArray.length}. Please check again.`
      })
    }

    // Check if each SKU is valid
    let wrongSKUIndex = -1
    const isValidSKUs = skus.every((sku, index) => {
      const isValid = sku.value === skuValueArray[index].value
      if (!isValid) {
        wrongSKUIndex = index
      }
      return isValid
    })
    if (!isValidSKUs) {
      ctx.addIssue({
        code: 'custom',
        path: ['skus'],
        message: `SKU value at index ${wrongSKUIndex} is invalid. Please check again.`
      })
    }
  })

export const UpdateProductBodySchema = CreateProductBodySchema

export type ProductType = z.infer<typeof ProductSchema>
export type VariantsType = z.infer<typeof VariantsSchema>
export type GetProductsResType = z.infer<typeof GetProductsResSchema>
export type GetProductsQueryType = z.infer<typeof GetProductsQuerySchema>
export type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>
export type GetProductParamsType = z.infer<typeof GetProductParamsSchema>
export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>
