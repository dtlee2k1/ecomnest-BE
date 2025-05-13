import { Body, Controller, Get, Put } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { ProfileService } from './profile.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

import { ChangePasswordBodyDto, UpdateMeBodyDto } from 'src/routes/profile/profile.dto'
import { MessageResDto } from 'src/shared/dtos/response.dto'
import { GetUserProfileResDto, UpdateProfileResDto } from 'src/shared/dtos/shared-user.dto'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodSerializerDto(GetUserProfileResDto)
  getProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.getProfile(userId)
  }

  @Put()
  @ZodSerializerDto(UpdateProfileResDto)
  updateProfile(@Body() body: UpdateMeBodyDto, @ActiveUser('userId') userId: number) {
    return this.profileService.updateProfile({
      userId,
      body
    })
  }

  @Put('change-password')
  @ZodSerializerDto(MessageResDto)
  changePassword(@Body() body: ChangePasswordBodyDto, @ActiveUser('userId') userId: number) {
    return this.profileService.changePassword({
      userId,
      body
    })
  }
}
