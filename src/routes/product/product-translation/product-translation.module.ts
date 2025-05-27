import { Module } from '@nestjs/common';
import { ProductTranslationService } from './product-translation.service';
import { ProductTranslationController } from './product-translation.controller';

@Module({
  controllers: [ProductTranslationController],
  providers: [ProductTranslationService],
})
export class ProductTranslationModule {}
