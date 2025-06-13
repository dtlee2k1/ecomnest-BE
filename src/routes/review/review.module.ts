import { Module } from '@nestjs/common'
import { ReviewService } from './review.service'
import { ReviewController } from './review.controller'
import { ReviewRepository } from 'src/routes/review/review.repo'

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository]
})
export class ReviewModule {}
