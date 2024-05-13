import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { ERRORS } from '../commons/utils';
import { MessageDto } from './dto/message.dto';
import { LLMHistory } from './schemas/llmHistory.schemas';
import { Model } from 'mongoose';


@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(LLMHistory.name) private readonly llmModel: Model<LLMHistory>,
  ) {}

  async insertOrUpdate(
    room: string,
    messageDto: LLMMessageDto,
  ): Promise<LLMHistoryDto> {
    let history = await this.llmModel.findOne({ room }).exec();

    if (history) {
      history.messages.push(messageDto);
    } else {
      history = new this.llmModel({
        room,
        messages: [messageDto],
      });
    }

    await history.save();

    const result: LLMHistoryDto = {
      messages: history.messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    };

    return result;
  }

  async deleteByRoom(room: string): Promise<any> {
    return await this.llmModel.findOneAndDelete({ room }).exec();
  }

  validateRoom(room: string) {
    if (!room) {
      throw new WsException({
        statusCode: ERRORS.ROOM_EMPTY.statusCode,
        message: ERRORS.ROOM_EMPTY.message,
      });
    }
  }

  validateSendMessage(data: MessageDto) {
    if (!data.message) {
      this.logger.error(`Validation Error: The message is empty.`);
      throw new WsException('The message cannot be empty.');
    }
    if (!data.nickname) {
      this.logger.error(`Validation Error: The nickname is empty.`);
      throw new WsException('The nickname cannot be empty.');
    }
    if (!data.room) {
      this.logger.error(`Validation Error: The room is empty.`);
      throw new WsException('The room cannot be empty.');
    }
  }
}
