import { atom } from 'recoil';

type ExecuteTestCase = {
  testCaseNumber?: string;
  userOutput?: string;
  resultCode?: number;
  userAnswer?: string;
};

type ExecuteResult = {
  [key: number]: ExecuteTestCase;
  statusCode?: number;
  executeId?: number;
  executeResult?: string;
};

interface ExecuteState {
  status: 'idle' | 'running' | 'completed' | 'error';
  language?: string;
  sourceCode?: string;
  stdinInput?: string;
  output?: string;
  kind?: string;
  message?: string; // 오류 메시지
}

export const executeState = atom<ExecuteState>({
  key: 'executeState',
  default: {
    status: 'idle',
    language: '',
    sourceCode: '',
    stdinInput: '',
  },
});
