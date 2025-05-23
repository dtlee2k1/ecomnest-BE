import { Module } from '@nestjs/common'
import { BrandTranslationService } from './brand-translation.service'
import { BrandTranslationController } from './brand-translation.controller'
import { BrandTranslationRepo } from './brand-translation.repo'

@Module({
  controllers: [BrandTranslationController],
  providers: [BrandTranslationService, BrandTranslationRepo]
})
export class BrandTranslationModule {}
