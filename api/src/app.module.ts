import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { QueryFailedErrorFilter } from './common/filters/query-failed-error.filter';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { CompaniesModule } from './companies/company.module';
import { EmployeesModule } from './employees/employees.module';
import { HealthModule } from './health/health.module';
import { PositionsModule } from './positions/positions.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validate,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        autoLoadEntities: true,
        synchronize: config.get<boolean>('database.synchronize'),
      }),
    }),
    HealthModule,
    CompaniesModule,
    UsersModule,
    PositionsModule,
    BranchesModule,
    EmployeesModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: QueryFailedErrorFilter,
    },
  ],
})
export class AppModule {}
