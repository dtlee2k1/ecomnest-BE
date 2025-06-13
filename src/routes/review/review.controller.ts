import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { ReviewService } from './review.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import {
  CreateReviewBodyDto,
  CreateReviewResDto,
  GetReviewDetailParamsDto,
  GetReviewsDto,
  GetReviewsParamsDto,
  UpdateReviewBodyDto,
  UpdateReviewResDto
} from 'src/routes/review/review.dto'
import { PaginationQueryDto } from 'src/shared/dtos/request.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @IsPublic()
  @Get('/products/:productId')
  @ZodSerializerDto(GetReviewsDto)
  getReviews(@Param() params: GetReviewsParamsDto, @Query() pagination: PaginationQueryDto) {
    return this.reviewService.list(params.productId, pagination)
  }

  @Post()
  @ZodSerializerDto(CreateReviewResDto)
  createReview(@Body() body: CreateReviewBodyDto, @ActiveUser('userId') userId: number) {
    return this.reviewService.create(userId, body)
  }

  @Put(':reviewId')
  @ZodSerializerDto(UpdateReviewResDto)
  updateReview(
    @Body() body: UpdateReviewBodyDto,
    @ActiveUser('userId') userId: number,
    @Param() params: GetReviewDetailParamsDto
  ) {
    return this.reviewService.update({
      userId,
      body,
      reviewId: params.reviewId
    })
  }
}
