import { Module } from '@nestjs/common';
import { CodeExecuteService } from './execute.service';
import { CodeExecuteController } from './execute.controller';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [RedisModule],
  controllers: [CodeExecuteController],
  providers: [CodeExecuteService],
  exports: [CodeExecuteService],
})
export class ExecuteModule {}
