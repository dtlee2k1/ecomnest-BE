import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from 'src/shared/shared.module'
import { AuthModule } from './routes/auth/auth.module'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import CustomValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter'
import { LanguageModule } from './routes/language/language.module'
import { PermissionModule } from './routes/permission/permission.module'
import { RoleModule } from './routes/role/role.module'
import { ProfileModule } from './routes/profile/profile.module'
import { UserModule } from './routes/user/user.module'
import { MediaModule } from 'src/routes/media/media.module'
import { BrandModule } from './routes/brand/brand.module'
import { BrandTranslationModule } from 'src/routes/brand/brand-translation/brand-translation.module'
import path from 'path'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import { CategoryModule } from './routes/category/category.module'
import { CategoryTranslationModule } from 'src/routes/category/category-translation/category-translation.module'
import { ProductModule } from './routes/product/product.module'
import { ProductTranslationModule } from 'src/routes/product/product-translation/product-translation.module'
import { CartModule } from './routes/cart/cart.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    LanguageModule,
    PermissionModule,
    RoleModule,
    ProfileModule,
    UserModule,
    MediaModule,
    BrandModule,
    BrandTranslationModule,
    CategoryModule,
    CategoryTranslationModule,
    ProductModule,
    ProductTranslationModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve('src/i18n/'),
        watch: true
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
      typesOutputPath: path.resolve('src/generated/i18n.generated.ts')
    }),
    ProductModule,
    CartModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule {}
