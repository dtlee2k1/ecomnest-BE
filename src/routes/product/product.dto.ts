import { createZodDto } from 'nestjs-zod'
import {
  CreateProductBodySchema,
  GetManageProductsQuerySchema,
  GetProductDetailResSchema,
  GetProductParamsSchema,
  GetProductsQuerySchema,
  GetProductsResSchema,
  ProductSchema,
  UpdateProductBodySchema
} from 'src/routes/product/product.model'

export class ProductDto extends createZodDto(ProductSchema) {}

export class GetProductsResDto extends createZodDto(GetProductsResSchema) {}

export class GetProductsQueryDto extends createZodDto(GetProductsQuerySchema) {}

export class GetManageProductsQueryDto extends createZodDto(GetManageProductsQuerySchema) {}

export class GetProductParamsDto extends createZodDto(GetProductParamsSchema) {}

export class GetProductDetailResDto extends createZodDto(GetProductDetailResSchema) {}

export class CreateProductBodyDto extends createZodDto(CreateProductBodySchema) {}

export class UpdateProductBodyDto extends createZodDto(UpdateProductBodySchema) {}
