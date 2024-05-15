import { useParams } from 'react-router-dom';
import { Socket} from 'socket.io-client';
import Spinner from './Spinner';
import ToggleAI from './ToggleAI';
import { CHATTING_SOCKET_EMIT_EVENT } from '../../../constants/chatEvents';
import useInput from '../../../hooks/useInput';
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoils/userState'; 

function SendButtonText({ usingAi, postingAi }: { usingAi: boolean; postingAi: boolean }) {
  if (!usingAi) return 'Send';
  if (postingAi) return <Spinner />;

  return 'Send AI';
}

interface ChattingInputProps {
  usingAi: boolean;
  setUsingAi: React.Dispatch<React.SetStateAction<boolean>>;
  postingAi: boolean;
  setPostingAi: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | null;
  moveToBottom: () => void;
  roomNumber: string;
}

export default function ChattingInput({ usingAi, setUsingAi, postingAi, setPostingAi, socket, moveToBottom, roomNumber }: ChattingInputProps) {
  const { value: message, onChange, onReset } = useInput<HTMLTextAreaElement>('');
  const nickname = useRecoilValue(userState).ID;

  const handleMessageSend = () => {
    if (!socket || !message) return;

    if (usingAi) {
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
      <ToggleAI usingAi={usingAi} setUsingAi={setUsingAi} />
      <div className="flex items-center w-full h-[72px] rounded-lg drop-shadow-lg">
        <textarea
          onKeyDown={handleKeyDown}
          disabled={usingAi && postingAi}
          value={message}
          onChange={onChange}
          className={`w-full h-full p-2 px-4 focus:outline-none rounded-s-lg resize-none border-2 custom-scroll ${
            usingAi ? 'border-point-blue' : 'border-white'
          }`}
          placeholder={usingAi ? 'Ask AI for insight' : 'Message to Peer'}
        />
        <button
          type="button"
          onClick={handleMessageSend}
          className={`font-normal rounded-e-lg whitespace-nowrap w-16 flex items-center justify-center h-full ${
            usingAi ? 'bg-point-blue text-white' : 'bg-primary text-black'
          }`}
          disabled={usingAi && postingAi}
        >
          <SendButtonText usingAi={usingAi} postingAi={postingAi} />
        </button>
      </div>
    </div>
  );
}
