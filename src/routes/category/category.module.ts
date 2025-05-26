import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { CategoryRepo } from 'src/routes/category/category.repo'

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo]
})
export class CategoryModule {}
