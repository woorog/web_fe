import { memo, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ErrorData, ErrorResponse, MessageData } from './ChatComponents/ChatTypes';
import ChattingMessage from './ChatComponents/ChattingMessage';
import ChattingInput from './ChatComponents/ChattingInput';
import ScrollDownButton from './ChatComponents/ScrollDownButton';
import ChatSection from './ChatComponents/ChatSection';
import ChatErrorToast from './ChatComponents/ChatErrorToast';
import createSocket from './ChatComponents/CreateChatSocket';
import { CHATTING_ERROR_TEXT, CHATTING_ERROR_STATUS_CODE } from '../../constants/chatEvents';
import useLastMessageViewingState from '../../hooks/useLastMessageViewingState';
import useScroll from '../../hooks/useScroll';
import { VITE_CHAT_SOCKET_SERVER_URL } from '../../constants/env';

interface ChattingSectionProps {
  roomNumber: string;
  onNewMessage: () => void; // 새로운 콜백 프로퍼티 추가
}

const ChattingSection: React.FC<ChattingSectionProps> = ({ roomNumber,onNewMessage }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [allMessages, setAllMessage] = useState<MessageData[]>([]);

  const [messageType, setMessageType] = useState<'human' | 'ai' | 'exec'>('human');
  const [postingAi, setPostingAi] = useState<boolean>(false);
  const [postingExec, setPostingExec] = useState<boolean>(false);

  const [errorData, setErrorData] = useState<ErrorData | null>(null);

  const { ref: messageAreaRef, scrollRatio, handleScroll, moveToBottom } = useScroll<HTMLDivElement>();
  const { isViewingLastMessage, isRecievedMessage, setIsRecievedMessage } = useLastMessageViewingState(scrollRatio);

  const handleRecieveMessage = (recievedMessage: MessageData | { using: boolean }) => {
    const remoteUsingAi = 'using' in recievedMessage;

    if (remoteUsingAi) {
      setPostingAi(recievedMessage.using);
      return;
    }

    if (recievedMessage.ai) setPostingAi(false);

    if ('exec' in recievedMessage && recievedMessage.exec) {
      setPostingExec(false); // Stop the spinner for exec messages
    }

    setAllMessage((prev) => [...prev, recievedMessage]);

    // 부모 컴포넌트에 알림
    onNewMessage();
  };

  const handleChattingSocketError = (errorMessage: ErrorResponse) => {
    const { statusCode } = errorMessage;

    const { MESSAGE_ERROR_CODE, SERVER_ERROR_CODE, AI_ERROR_CODE, EXEC_ERROR_CODE } = CHATTING_ERROR_STATUS_CODE;
    const { MESSAGE_ERROR_TEXT, SERVER_ERROR_TEXT, AI_ERROR_TEXT, EXEC_ERROR_TEXT } = CHATTING_ERROR_TEXT;

    if (statusCode === MESSAGE_ERROR_CODE) setErrorData(MESSAGE_ERROR_TEXT);
    if (statusCode === SERVER_ERROR_CODE) setErrorData(SERVER_ERROR_TEXT);
    if (statusCode === AI_ERROR_CODE) setErrorData(AI_ERROR_TEXT);
    if (statusCode === EXEC_ERROR_CODE) setErrorData(EXEC_ERROR_TEXT);
  };

  const socketConnect = async () => {
    const socketURL = VITE_CHAT_SOCKET_SERVER_URL;
    const socketCallbacks = {
      'new_message': handleRecieveMessage,
      exception: handleChattingSocketError,
    };

    const newSocket = createSocket(socketURL, socketCallbacks);
    newSocket.connect();

    newSocket.emit('join_room', { room: roomNumber });

    setSocket(newSocket);
  };

  useEffect(() => {
    socketConnect();
  }, []);

  useEffect(() => {
    if (isViewingLastMessage) moveToBottom();
    else setIsRecievedMessage(true);
  }, [allMessages]);

  return (
    <ChatSection>
      <div className="flex relative flex-col items-center justify-center w-full pt-2 h-full rounded-lg bg-primary min-w-[150px]">
        <div
          ref={messageAreaRef}
          className="flex flex-col w-full h-full gap-2 px-2 py-2 pl-4 mr-4 overflow-auto grow custom-scroll"
          onScroll={handleScroll}
        >
          {allMessages.map((messageData, index) => (
            <ChattingMessage messageData={messageData} key={index} isMyMessage={messageData.socketId === socket?.id} />
          ))}
        </div>
        {isRecievedMessage && <ScrollDownButton handleMoveToBottom={moveToBottom} />}
        {errorData && <ChatErrorToast errorData={errorData} setErrorData={setErrorData} />}
        <ChattingInput
          messageType={messageType}
          setMessageType={setMessageType}
          postingAi={postingAi}
          setPostingAi={setPostingAi}
          postingExec={postingExec}
          setPostingExec={setPostingExec}
          socket={socket}
          moveToBottom={moveToBottom}
          roomNumber={roomNumber}
        />
      </div>
    </ChatSection>
  );
}

export default memo(ChattingSection);

