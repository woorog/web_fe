import { ConfigService } from '@nestjs/config';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { MessageDto } from './dto/message.dto';
import { ERRORS, SOCKET, SOCKET_EVENT } from '../commons/utils';
import { ChatService } from './chat.service';
import * as os from 'os';
import axios from 'axios';
import Redis from 'ioredis';

@WebSocketGateway({ namespace: SOCKET.NAME_SPACE, cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger();
  private roomToCount: Map<string, number> = new Map();
  private instanceId = process.env.NODE_APP_INSTANCE || os.hostname();
  private subscriberClient: Redis;
  private publisherClient: Redis;

  constructor(
    @InjectRedis() private readonly client: Redis,
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {
    this.subscriberClient = client.duplicate();
    this.publisherClient = client.duplicate();

    this.subscriberClient.subscribe(SOCKET.REDIS_CHAT_CHANEL);

    this.subscriberClient.on('message', this.handleChatMessage.bind(this));
  }

  private handleChatMessage(channel: string, message: string) {
    if (channel === SOCKET.REDIS_CHAT_CHANEL) {
      const { room, ...messageData } = JSON.parse(message);
      this.server.to(room).emit(SOCKET_EVENT.NEW_MESSAGE, messageData);
    }
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Instance ${this.instanceId} - connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Instance ${this.instanceId} - disconnected: ${socket.id}`);
  }

  @SubscribeMessage(SOCKET_EVENT.JOIN_ROOM)
  handleJoin(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`Instance ${this.instanceId} - joinRoom: ${socket.id}`);

    const { room } = data;
    this.chatService.validateRoom(room);

    socket.join(room);

    const count = this.roomToCount.get(room) || 0;
    this.roomToCount.set(room, count + 1);
  }

  @SubscribeMessage(SOCKET_EVENT.LEAVE_ROOM)
  async handleLeave(
    @MessageBody() data: LeaveRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`Instance ${this.instanceId} - leaveRoom: ${socket.id}`);

    const { room } = data;
    this.chatService.validateRoom(room);

    socket.leave(room);

    const count = (this.roomToCount.get(room) || 1) - 1;
    this.roomToCount.set(room, count);

    if (count === SOCKET.EMPTY_ROOM) {
      this.roomToCount.delete(room);
      this.chatService.deleteByRoom(room);
    }
  }

  @SubscribeMessage(SOCKET_EVENT.SEND_MESSAGE)
  async handleMessage(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    this.logger.log(`Instance ${this.instanceId} - sendMessage: ${socket.id}`);

    this.chatService.validateSendMessage(data);

    const { room, message, nickname, ai } = data;

    this.logger.log(`Instance ${this.instanceId} - message: ${data.message}`);

    const response = {
      room: room,
      message: message,
      nickname: nickname,
      socketId: socket.id,
      ai: ai,
    };

    if (ai) {
      try {
        await this.publisherClient.publish(
          SOCKET.REDIS_CHAT_CHANEL,
          JSON.stringify({ room: room, using: true }),
        );

        const llmMessageDto: LLMMessageDto = await this.processAIResponse(
          room,
          message,
          socket.id,
        );

        await this.chatService.insertOrUpdate(room, llmMessageDto);
        response.message = llmMessageDto.content;
      } catch (error) {
        throw new WsException({
          statusCode: ERRORS.FAILED_ACCESS_LLM.statusCode,
          message: ERRORS.FAILED_ACCESS_LLM.message,
        });
      }
    }

    try {
      await this.publisherClient.publish(
        SOCKET.REDIS_CHAT_CHANEL,
        JSON.stringify(response),
      );
    } catch (error) {
      throw new WsException({
        statusCode: ERRORS.FAILED_PUBLISHING.statusCode,
        message: ERRORS.FAILED_PUBLISHING.message,
      });
    }
  }

  public getRoomCount(room: string): number {
    return this.roomToCount.get(room) || 0;
  }

  public async useLLM(room: string, message: string, socketId: string) {
    this.logger.log(`currently in useLLM`);
    const url = this.configService.get<string>('LLM_URL');
    const headers = {
      'X-NCP-CLOVASTUDIO-API-KEY':
        this.configService.get<string>('CLOVASTUDIO'),
      'X-NCP-APIGW-API-KEY': this.configService.get<string>('APIGW'),
      'X-NCP-CLOVASTUDIO-REQUEST-ID':
        this.configService.get<string>('REQUESTID'),
      ContentType: this.configService.get<string>('ContentType'),
      Accept: this.configService.get<string>('Accept'),
    };

    const newMessage: LLMMessageDto = {
      role: 'user',
      content: message,
    };

    const llmHistory: LLMHistoryDto = await this.chatService.insertOrUpdate(
      room,
      newMessage,
    );

    const data: LLMRequestDto = {
      messages: llmHistory.messages,
      topP: 0.8,
      topK: 0,
      maxTokens: 256,
      temperature: 0.5,
      repeatPenalty: 5.0,
      stopBefore: [],
      includeAiFilters: true,
    };

    try {
      this.logger.log(`Sending AI request for room ${room}, message ${message}`);
      const response = await axios.post(url, data, { headers });
      this.logger.log(`AI response for ${socketId}: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      this.logger.error(`AI request failed for ${socketId}: ${error.message}`);
      throw error;
    }
  }

  async processAIResponse(room: string, message: string, socketId: string): Promise<LLMMessageDto> {
    try {
        const response = await this.useLLM(room, message, socketId);
        this.logger.log(`Processing AI llmStream: ${JSON.stringify(response)}`);
        
        const result = response.result;
        if (!result || !result.message) {
            throw new Error('Invalid AI response structure.');
        }

        const { role, content } = result.message;
        if (!role || !content) {
            throw new Error('Missing role or content in AI message.');
        }

        this.logger.log(`Extracted message from AI: role = ${role}, content = ${content}`);

        return {
            role: role,
            content: content
        };
    } catch (error) {
        this.logger.error(`Error processing AI response: ${error.message}`);
        throw new WsException({
            statusCode: ERRORS.FAILED_ACCESS_LLM.statusCode,
            message: ERRORS.FAILED_ACCESS_LLM.message,
        });
    }
  }
}
