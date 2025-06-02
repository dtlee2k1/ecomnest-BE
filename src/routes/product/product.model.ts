import { ProductTranslationSchema } from 'src/routes/product/product-translation/product-translation.model'
import { UpsertSKUBodySchema } from 'src/routes/product/sku.model'
import { OrderBy, SortBy } from 'src/shared/constants/other.constant'
import { BrandIncludeTranslationSchema } from 'src/shared/models/shared-brand.model'
import { CategoryIncludeTranslationSchema } from 'src/shared/models/shared-category.model'
import { ProductSchema, VariantsType } from 'src/shared/models/shared-product.model'
import { SKUSchema } from 'src/shared/models/shared-sku.model'
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

// For Client and Guest
export const GetProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  name: z.string().optional(),
  brandIds: z.preprocess((value) => {
    if (typeof value === 'string') {
      return [Number(value)]
    }
    return value
  }, z.array(z.coerce.number().int().positive()).optional()),
  categories: z.preprocess((value) => {
    if (typeof value === 'string') {
      return [Number(value)]
    }
    return value
  }, z.array(z.coerce.number().int().positive()).optional()),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  createdById: z.coerce.number().int().positive().optional(),
  orderBy: z.enum([OrderBy.Asc, OrderBy.Desc]).default(OrderBy.Desc),
  sortBy: z.enum([SortBy.Price, SortBy.CreatedAt, SortBy.Sale]).default(SortBy.CreatedAt)
})

// For Admin and Seller
export const GetManageProductsQuerySchema = GetProductsQuerySchema.extend({
  isPublic: z.preprocess((value) => value === 'true', z.boolean()).optional(),
  createdById: z.coerce.number().int().positive()
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

export type GetProductsResType = z.infer<typeof GetProductsResSchema>
export type GetProductsQueryType = z.infer<typeof GetProductsQuerySchema>
export type GetManageProductsQueryType = z.infer<typeof GetManageProductsQuerySchema>
export type GetProductDetailResType = z.infer<typeof GetProductDetailResSchema>
export type CreateProductBodyType = z.infer<typeof CreateProductBodySchema>
export type GetProductParamsType = z.infer<typeof GetProductParamsSchema>
export type UpdateProductBodyType = z.infer<typeof UpdateProductBodySchema>
