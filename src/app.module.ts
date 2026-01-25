import { Module, MiddlewareConsumer } from '@nestjs/common';
import LoggerMiddleware from './configs/middlewares/logger.middleware';
import { DatabaseModule } from './modules/database/database.module';
import { LoggerModule } from './modules/log/logs.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './configs/decorators/catchError';
import { ProductModule } from './modules/product/product.module';
import { IndustryModule } from './modules/industry/industry.module';
import { CompanyModule } from './modules/company/company.module';
import { CompanyPointModule } from './modules/companyPoint/companyPoint.module';
import { CriteriaItemModule } from './modules/criteriaItem/criteriaItem.module';
import { PredictionModule } from './modules/prediction/prediction.module';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        // PostgresQL
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PGSSLMODE: Joi.string()
          .valid(
            'disable',
            'allow',
            'prefer',
            'require',
            'verify-ca',
            'verify-full',
          )
          .default('disable'),

        // Port server
        PORT: Joi.number(),

        // JWT
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ProductModule,
    IndustryModule,
    CompanyModule,
    CompanyPointModule,
    CriteriaItemModule,
    PredictionModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
