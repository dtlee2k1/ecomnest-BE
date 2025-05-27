import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductTranslationModule } from './product-translation/product-translation.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [ProductTranslationModule],
})
export class ProductModule {}
