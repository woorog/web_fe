import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import Spinner from './Spinner';
import ToggleAI from './ToggleAI';
import { CHATTING_SOCKET_EMIT_EVENT } from '../../../constants/chatEvents';
import useInput from '../../../hooks/useInput';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userState } from '../../../recoils/userState';
import { executeState } from '../../../recoils/executeState';
import { editorState } from '../../../recoils';

function SendButtonText({
  usingAi,
  postingAi,
}: {
  usingAi: boolean;
  postingAi: boolean;
}) {
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
  execInput?: boolean;
}

export default function ChattingInput({
  usingAi,
  setUsingAi,
  postingAi,
  setPostingAi,
  socket,
  moveToBottom,
  roomNumber,
  execInput = false,
}: ChattingInputProps) {
  const {
    value: message,
    onChange,
    onReset,
  } = useInput<HTMLTextAreaElement>('');
  const nickname = useRecoilValue(userState).ID;
  const [editor] = useRecoilState(editorState);
  const [execute, setExecute] = useRecoilState(executeState);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecInput, setIsExecInput] = useState(execInput);

  const handleMessageSend = () => {
    console.log('handleMessageSend called');
    // if (!socket || !message) {
    if (!socket) {
      console.log('No socket or message, returning');
      return;
    }

    if (usingAi) {
      console.log('Sending AI message');
      setPostingAi(true);
      socket.emit(CHATTING_SOCKET_EMIT_EVENT.SEND_MESSAGE, {
        room: roomNumber,
        message,
        nickname: `${nickname} - AI에게 보낸 메세지`,
        ai: false,
        execInput: false,
      });
      socket.emit(CHATTING_SOCKET_EMIT_EVENT.SEND_MESSAGE, {
        room: roomNumber,
        message,
        nickname,
        ai: true,
        execInput: false,
      });
    } else if (isExecInput) {
      console.log('Executing code');
      setIsLoading(true);
      setExecute((prev) => ({
        ...prev,
        status: 'running',
      }));

      const param = {
        language: execute.language ? execute.language.toLowerCase() : 'python',
        sourceCode: execute.sourceCode,
        stdinInput: execute.stdinInput || '',
      };

      console.log('Fetch parameters:', param);

      fetch(`http://localhost:8888/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(param),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log('Execution result:', data);
          const { execId, ...result } = data;
          console.log(
            'Sending execution result via socket:',
            result.run.output,
          ); // 추가된 부분
          socket.emit(CHATTING_SOCKET_EMIT_EVENT.SEND_MESSAGE, {
            room: roomNumber,
            message: result.run.output,
            nickname: '실행결과',
            ai: false,
            execInput: true,
            execOutput: result.run.output,
            execId: execId,
          });
          setExecute((prev) => ({
            ...prev,
            status: 'completed',
            output: result.output,
          }));
        })
        .catch((error) => {
          console.error('Execution error:', error);
          setExecute((prev) => ({
            ...prev,
            status: 'error',
            message: error.message,
          }));
        })
        .finally(() => {
          console.log('Execution finished');
          setIsLoading(false);
          setIsExecInput(false);
          onReset();
          moveToBottom();
        });
    } else {
      console.log('Sending normal message');
      socket.emit(CHATTING_SOCKET_EMIT_EVENT.SEND_MESSAGE, {
        room: roomNumber,
        message,
        nickname,
        ai: false,
        execInput: false,
      });
    }

    onReset();
    moveToBottom();
    console.log('handleMessageSend finished');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();

      if (!message) return;

      handleMessageSend();
    }
  };

  //////
  useEffect(() => {
    if (isExecInput) {
      handleMessageSend();
    }
  }, [isExecInput]);

  const handleExecuteClick = () => {
    console.log('Execute button clicked');
    setIsExecInput(true); // 상태를 true로 설정
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
        <button
          type="button"
          onClick={handleExecuteClick}
          className="ml-2 bg-green-500 text-white rounded-lg p-2"
        >
          {isLoading ? 'Executing...' : 'Execute Code'}
        </button>
      </div>
    </div>
  );
}
