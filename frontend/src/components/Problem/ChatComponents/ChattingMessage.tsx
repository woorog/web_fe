import { memo } from 'react';
import { MessageData } from './ChatTypes';

interface ChattingMessageProps {
  messageData: MessageData;
  isMyMessage: boolean;
}

function ChattingMessage({ messageData, isMyMessage }: ChattingMessageProps) {
  const aiMessage = messageData.ai;
  const myMessage = !aiMessage && isMyMessage;

  const getMessageColor = () => {
    if (aiMessage) return 'bg-lime-300 text-black';
    if (myMessage) return 'bg-blue-100';

    return 'bg-yellow-100';
  };

  return (
    <div className={`flex flex-col gap-0.5 ${myMessage ? 'items-end' : 'items-start'}`}>
      <span className="mx-1 text-xs font-light">{aiMessage ? 'Clova X (AI)' : messageData.nickname}</span>
      <div className={`px-4 py-2 rounded-lg w-fit ${getMessageColor()}`}>
        <span className="whitespace-pre-wrap">{messageData.message}</span>
      </div>
    </div>
  );
}

export default memo(ChattingMessage);
