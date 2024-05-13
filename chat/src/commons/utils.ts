import { HttpStatus } from '@nestjs/common';

export const SOCKET = {
  NAME_SPACE: 'chat',
  EMPTY_ROOM: 0,
  REDIS_CHAT_CHANEL: 'RedisChatting',
};

export const SOCKET_EVENT = {
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',

  NEW_MESSAGE: 'new_message',
  SEND_MESSAGE: 'send_message',
};

export const ERRORS = {
  NICKNAME_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'User not found',
  },
  ROOM_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Room not found',
  },
  SEND_MESSAGE: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Message Send Error',
  },
  MESSAGE_EMPTY: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Message Empty Error',
  },
  FAILED_PUBLISHING: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Serverside Message Error',
  },
  FAILED_ACCESS_LLM: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    message: 'LLM Service Overload',
  },
  FAILED_PARSING: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Bad Request',
  },
};
