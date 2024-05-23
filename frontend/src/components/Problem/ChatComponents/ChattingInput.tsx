import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import Spinner from './Spinner';
import ToggleMessageType from './ToggleMessateType';
import { CHATTING_SOCKET_EMIT_EVENT } from '../../../constants/chatEvents';
import useInput from '../../../hooks/useInput';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoils/userState';

function SendButtonText({ messageType, postingAi }: { messageType: 'human' | 'ai' ; postingAi: boolean }) {
  if (messageType === 'human') {
    return 'Send';
  } 
  if (postingAi) return <Spinner />;

  return 'Ask AI';
}

interface ChattingInputProps {
  messageType: 'human' | 'ai';
  setMessageType: React.Dispatch<React.SetStateAction<'human' | 'ai'>>;
  postingAi: boolean;
  setPostingAi: React.Dispatch<React.SetStateAction<boolean>>;
  postingExec: boolean;
  setPostingExec: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | null;
  moveToBottom: () => void;
  roomNumber: string;
}

export default function ChattingInput({ messageType, setMessageType, postingAi, setPostingAi, socket, moveToBottom, roomNumber }: ChattingInputProps) {
  const { value: message, onChange, onReset } = useInput<HTMLTextAreaElement>('');
  const nickname = useRecoilValue(userState).ID;

  const handleMessageSend = () => {
    if (!socket || !message) return;

    if (messageType === 'ai') {
      setPostingAi(true);
      socket.emit(CHATTING_SOCKET_EMIT_EVENT.SEND_MESSAGE, { room: roomNumber, message, nickname: `${nickname} - AI에게 보낸 메세지`, ai: false });
      socket.emit(CHATTING_SOCKET_EMIT_EVENT.SEND_MESSAGE, { room: roomNumber, message, nickname, ai: true });
    } else {
      socket.emit(CHATTING_SOCKET_EMIT_EVENT.SEND_MESSAGE, { room: roomNumber, message, nickname, ai: false });
    }

    onReset();
    moveToBottom();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();

      if (!message) return;

      handleMessageSend();
    }
  };

  return (
    <div className="w-full p-2 rounded-b-lg bg-base">
      <ToggleMessageType messageType={messageType} setMessageType={setMessageType} />
      <div className="flex items-center w-full h-[72px] rounded-lg drop-shadow-lg">
        <textarea
          onKeyDown={handleKeyDown}
          disabled={(messageType === 'ai' && postingAi)}
          value={message}
          onChange={onChange}
          className={`w-full h-full p-2 px-4 focus:outline-none rounded-s-lg resize-none border-2 custom-scroll ${
            messageType === 'ai' ? 'border-point-blue' : 'border-point-blue'
          }`}
          placeholder={messageType === 'ai' ? 'Ask AI for insight' : 'Message to Peer'}
        />
        <button
          type="button"
          onClick={handleMessageSend}
          className={`font-normal rounded-e-lg whitespace-nowrap w-16 flex items-center justify-center h-full ${
            messageType === 'ai' ? 'bg-lime-500 text-white' : 'bg-blue-300 text-black'
          }`}
          disabled={(messageType === 'ai' && postingAi)}
        >
          <SendButtonText messageType={messageType} postingAi={postingAi} />
        </button>
      </div>
    </div>
  );
}
