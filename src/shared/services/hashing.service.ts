import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'

const saltRounds = 10

@Injectable()
export class HashingService {
  async hashPassword(password: string) {
    return await hash(password, saltRounds)
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword)
  }
}
