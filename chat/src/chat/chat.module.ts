import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { LLMHistory, LLMHistorySchema } from './schemas/llmHistory.schemas';
import { ExecuteModule } from '../execute/execute.module'; // ExecuteModule 가져오기

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LLMHistory.name, schema: LLMHistorySchema },
    ]),
    ExecuteModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
