import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { ProductRepo } from 'src/routes/product/product.repo'
import { ManageProductService } from 'src/routes/product/manage-product.service'
import { ManageProductController } from 'src/routes/product/manage-product.controller'

@Module({
  controllers: [ProductController, ManageProductController],
  providers: [ProductService, ProductRepo, ManageProductService]
})
export class ProductModule {}
