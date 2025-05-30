import { z } from 'zod'

export const SKUSchema = z.object({
  id: z.number(),
  value: z.string().trim(),
  price: z.number().min(0),
  stock: z.number().min(0),
  image: z.string(),
  productId: z.number(),

  createdById: z.number().nullable(),
  updatedById: z.number().nullable(),
  deletedById: z.number().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const UpsertSKUBodySchema = SKUSchema.pick({
  value: true,
  price: true,
  stock: true,
  image: true
})

export type SKUSchemaType = z.infer<typeof SKUSchema>
export type UpsertSKUBodyType = z.infer<typeof UpsertSKUBodySchema>
