import { Injectable } from '@nestjs/common'
import { RegisterBodyType, UserType } from 'src/routes/auth/auth.model'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(
    data: Omit<RegisterBodyType, 'confirmPassword'> & Pick<UserType, 'roleId'>
  ): Promise<Omit<UserType, 'password' | 'totpSecret'>> {
    return await this.prismaService.user.create({
      data,
      omit: {
        password: true,
        totpSecret: true
      }
    })
  }
}
