import { Module } from '@nestjs/common'
import { ProductTranslationService } from './product-translation.service'
import { ProductTranslationController } from './product-translation.controller'
import { ProductTranslationRepo } from 'src/routes/product/product-translation/product-translation.repo'

@Module({
  controllers: [ProductTranslationController],
  providers: [ProductTranslationService, ProductTranslationRepo]
})
export class ProductTranslationModule {}
