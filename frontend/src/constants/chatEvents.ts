export const CHATTING_SOCKET_RECIEVE_EVENT = {
  NEW_MESSAGE: 'new_message',
};

export const CHATTING_SOCKET_EMIT_EVENT = {
  JOIN_ROOM: 'join_room',
  SEND_MESSAGE: 'send_message',
};

export const CHATTING_ERROR_STATUS_CODE = {
  MESSAGE_ERROR_CODE: 400,
  SERVER_ERROR_CODE: 500,
  AI_ERROR_CODE: 429,
  EXEC_ERROR_CODE: 439,
};

export const CHATTING_ERROR_TEXT = {
  MESSAGE_ERROR_TEXT: { text1: 'Something went wrong', text2: '' },
  SERVER_ERROR_TEXT: { text1: 'Servers are down', text2: '' },
  AI_ERROR_TEXT: { text1: 'Someone else is using AI', text2: '' },
  EXEC_ERROR_TEXT: { text1: 'Someone else is Executing the Code', text2: '' },
};
