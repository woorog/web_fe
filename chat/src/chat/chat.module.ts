import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { LLMHistory, LLMHistorySchema } from './schemas/llmHistory.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LLMHistory.name, schema: LLMHistorySchema },
    ]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
