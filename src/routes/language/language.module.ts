import { Module } from '@nestjs/common'
import { LanguageService } from './language.service'
import { LanguageController } from './language.controller'
import { LanguageRepo } from 'src/routes/language/language.repo'

@Module({
  controllers: [LanguageController],
  providers: [LanguageService, LanguageRepo]
})
export class LanguageModule {}
