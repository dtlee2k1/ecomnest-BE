import { Controller } from '@nestjs/common';
import { ProductTranslationService } from './product-translation.service';

@Controller('product-translation')
export class ProductTranslationController {
  constructor(private readonly productTranslationService: ProductTranslationService) {}
}
