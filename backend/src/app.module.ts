import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as process from 'process';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ProblemModule } from './problem/problem.module';
import { Problem } from './problem/entities/problem.entity';
import { SolvedModule } from './solved/solved.module';
import { Solved } from './solved/entities/solved.entity';
import { TestCase } from './test-case/entities/test-case.entity';
import { TestCaseModule } from './test-case/test-case.module';
import { AuthModule } from './auth/auth.module';
import { typeormConfig } from './config/typeorm.config';
import { CrawlerModule } from './crawler/crawler.module';
import { ExecuteModule } from './execute/execute/execute.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
      envFilePath:
        process.env.NODE_ENV === 'development' ? `.env` : '.env.production',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [User, TestCase, Solved, Problem],
        dropSchema: false,
        synchronize: true,
        logging: true,
      }),
    }),
    UsersModule,
    ProblemModule,
    TestCaseModule,
    SolvedModule,
    AuthModule,
    CrawlerModule,
    ExecuteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
