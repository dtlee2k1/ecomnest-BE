import { Module } from '@nestjs/common'
import { BrandService } from './brand.service'
import { BrandController } from './brand.controller'
import { BrandRepo } from 'src/routes/brand/brand.repo'

@Module({
  controllers: [BrandController],
  providers: [BrandService, BrandRepo]
})
export class BrandModule {}
