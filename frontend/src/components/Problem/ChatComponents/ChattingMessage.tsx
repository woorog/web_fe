import { memo } from 'react';
import { MessageData } from './ChatTypes';
import clova from '../../../assets/clova-white.png';

interface ChattingMessageProps {
  messageData: MessageData;
  isMyMessage: boolean;
}

function ChattingMessage({ messageData, isMyMessage }: ChattingMessageProps) {
  const aiMessage = messageData.ai;
  const myMessage = !aiMessage && isMyMessage;

  const getMessageColor = () => {
    if (aiMessage) return 'bg-lime-500 text-white';
    if (myMessage) return 'bg-blue-100';

    return 'bg-yellow-100';
  };

  return (
    <div className={`flex flex-col gap-0.5 ${myMessage ? 'items-end' : 'items-start'}`}>
      <span className="mx-1 text-xs font-light">
        {aiMessage ? 'AI Response' : messageData.nickname}
      </span>
      <div className={`px-4 py-2 rounded-lg w-fit ${getMessageColor()}`}>
        {aiMessage && <img src={clova} alt="Clova" className="w-40 h-12 mr-2" />}
        <span className="whitespace-pre-wrap">{messageData.message}</span>
      </div>
    </div>
  );
}

export default memo(ChattingMessage);
