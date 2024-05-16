// React Router를 사용해 URL 파라미터 및 네비게이션 기능을 사용
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 다양한 UI 컴포넌트와 페이지 요소를 임포트
import { PageButtons, ProblemButtons } from '../components/Problem/Buttons';
import { ProblemHeader } from '../components/ProblemHeader';
import { ProblemContent, Result } from '../components/Problem';
// TypeScript 인터페이스나 타입 정의를 사용
import { ProblemInfo } from '@types';
// 상태 관리를 위한 Recoil 훅
import { useRecoilState } from 'recoil';
import { editorState, gradingState } from '../recoils';
// Additional utility
import { Video } from '../components/Problem/Video';
import editorColors from '../utils/editorColors';
import LanguageSelector from '../components/Problem/LanguageSelector';
import defaultCodes from '../utils/defaultCode';
// 실시간 협업을 위한 Yjs 라이브러리와 WebRTC 연동
import * as Y from 'yjs';
// @ts-ignore
import { yCollab } from 'y-codemirror.next';
import { WebrtcProvider } from 'y-webrtc';
// 코드 미러 라이브러리를 사용한 텍스트 에디터 설정
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, Compartment } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
// 추가적인 훅, 유틸리티 컴포넌트
import * as random from 'lib0/random';
import { useUserState } from '../hooks/useUserState';
import Canvas from '../components/Canvas/Canvas';
import '../../App.css';

// CSS in JS
import {
  Wrapper,
  HeaderWrapper,
  MainWrapper,
  VideoContainer,
} from './ProblemStyle';

const URL = import.meta.env.VITE_SERVER_URL;
const REM = getComputedStyle(document.documentElement).fontSize;
const webRTCURL = import.meta.env.VITE_SOCKET_URL;

const languageCompartment = new Compartment();

const langs = {
  JavaScript: javascript(),
  Python: python(),
};

const Problem = () => {
  useUserState();

  const startResizing = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };

  const resize = (e: { movementY: number }) => {
    if (editorRef.current) {
      // null 체크 추가
      const currentHeight = editorRef.current.clientHeight;
      const newHeight = currentHeight + e.movementY;
      editorRef.current.style.height = `${newHeight}px`;
    }
  };
  const stopResize = () => {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  };

  const [leftWidth, setLeftWidth] = useState(50); // 초기 왼쪽 패널 너비 (퍼센트)
  const [showEditor, setShowEditor] = useState(true);
  const navigate = useNavigate();
  const [, setGrade] = useRecoilState(gradingState);
  const [, setEState] = useState<EditorState>();
  const [eView, setEView] = useState<EditorView>();
  const [problem, setProblem] = useState<ProblemInfo>();
  const { id, version, roomNumber = '' } = useParams();
  const [isMultiVersion] = useState(version === 'multi');
  const [code, setCode] = useRecoilState(editorState);
  const [language, setLanguage] = useState(code.language);
  const [text, setText] = useState(code.text);
  const [param, setParam] = useState(1);
  const [defaultCode, setDefaultCode] = useState({ ...defaultCodes });
  const problemRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const ydoc = useMemo(() => new Y.Doc(), []);
  const [provider, ytext] = useMemo(() => {
    return [
      isMultiVersion
        ? // @ts-ignore
          new WebrtcProvider(roomNumber, ydoc, {
            signaling: [webRTCURL],
            maxConns: 3,
          })
        : null,
      ydoc.getText('codemirror'),
    ];
  }, []);

  const undoManager = useMemo(() => new Y.UndoManager(ytext), []);
  const userColor = useMemo(
    () => editorColors[random.uint32() % editorColors.length],
    [],
  );

  useEffect(() => {
    let lang = '';
    if (
      text === defaultCode['JavaScript'] ||
      text.includes('function solution')
    )
      lang = 'JavaScript';
    else if (text === defaultCode['Python'] || text.includes('def solution'))
      lang = 'Python';
    if (lang) setCode({ ...code, text, language: lang });
    else setCode({ ...code, text });
  }, [text]);

  useEffect(() => {
    if (!eView) return;
    setLanguage(code.language);
  }, [code]);

  useEffect(() => {
    if (eView && (language === 'JavaScript' || language === 'Python')) {
      eView.dispatch({
        effects: languageCompartment.reconfigure(langs[language]),
      });
    }
  }, [language]);

  useEffect(() => {
    if (!isMultiVersion || !!roomNumber) {
      return;
    }
    alert('올바르지 않은 URL 입니다.');
    navigate('/');
  }, [isMultiVersion, roomNumber]);

  useEffect(() => {
    fetch(`${URL}/problem/${id}`)
      .then((res) => res.json())
      .then((res) => {
        const { level, title, description } = res;
        setProblem({ level, title, description });
      })
      .catch(() => {
        alert('문제를 불러올 수 없습니다');
        navigate('/problems');
      });
  }, [id]);

  useEffect(() => {
    if (!problem) return;
    fetch(`${URL}/test-case?problemId=${id}`)
      .then((res) => res.json())
      .then((res) => {
        const testcase = res[0];
        const { testInput } = testcase;
        setParam(JSON.parse(testInput).length);
      });
  }, [problem]);

  useEffect(() => {
    const params = [...new Array(param)].map((elem, idx) => `param${idx + 1}`);
    const paramsStr = param === 1 ? 'param' : params.join(', ');
    const { JavaScript, Python } = defaultCode;
    setDefaultCode({
      ...defaultCode,
      JavaScript: JavaScript.replace('param', paramsStr),
      Python: Python.replace('param', paramsStr),
    });
  }, [param]);

  useEffect(() => {
    if (eView) return;
    provider &&
      provider.awareness.setLocalStateField('user', {
        name: 'Anonymous ' + Math.floor(Math.random() * 100),
        color: userColor.color,
        colorLight: userColor.light,
      });

    const languageExtension = languageCompartment.of(langs['JavaScript']);

    const extensions = [
      basicSetup,
      keymap.of([indentWithTab]),
      languageExtension,
      EditorView.updateListener.of(function (e) {
        setText(e.state.doc.toString());
      }),
    ];
    provider &&
      extensions.push(yCollab(ytext, provider.awareness, { undoManager }));

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions,
    });
    setEState(state);
    if (editorRef.current) {
      const view = new EditorView({ state, parent: editorRef.current });
      setEView(view);
    }
    return () => {
      provider && provider.destroy();
    };
  }, []);

  useEffect(() => {
    if (!eView) return;
    if (version === 'single') {
      const transaction = eView.state.update({
        changes: {
          from: 0,
          to: eView.state.doc.length,
          insert: defaultCode[''],
        },
      });
      eView.dispatch(transaction);
    } else {
      setTimeout(() => {
        let transaction;
        if (ytext.toString() == '') {
          transaction = eView.state.update({
            changes: {
              from: 0,
              to: eView.state.doc.length,
              insert: defaultCode[''],
            },
          });
          eView.dispatch(transaction);
        }
      }, 3000);
    }
  }, [eView]);

  useEffect(() => {
    window.addEventListener('resize', handleSize);
    return () => {
      window.removeEventListener('resize', handleSize);
    };
  }, []);

  useEffect(() => {
    setGrade({
      status: 'ready',
    });
    setCode({
      text: '',
      language: '',
    });
  }, []);

  useEffect(() => {
    removeLocalStorage();
    return () => {
      removeLocalStorage();
    };
  }, []);

  const removeLocalStorage = () => {
    localStorage.removeItem('JavaScript');
    localStorage.removeItem('Python');
  };

  const saveCode = (code: string, language: string) => {
    localStorage.setItem(language, code);
  };

  const getSavedCode = (language: string) => {
    return localStorage.getItem(language);
  };

  const handleChangeEditorLanguage = (language: string) => {
    if (eView) {
      let insertCode;
      const { text: priorText, language: priorLanguage } = code;
      if (priorLanguage) saveCode(priorText, priorLanguage);
      if (language === '' || language === 'JavaScript' || language === 'Python')
        insertCode = defaultCode[language];
      const savedCode = getSavedCode(language);
      if (savedCode) insertCode = savedCode;
      const transaction = eView.state.update({
        changes: { from: 0, to: eView.state.doc.length, insert: insertCode },
      });
      eView.dispatch(transaction);
    }
  };
  const handleSize = () => {
    const PX = +REM.replace('px', '');
    if (editorRef.current)
      editorRef.current.style.maxWidth = `${Math.max(
        80 * PX * 0.485,
        window.innerWidth * 0.485,
      )}px`;
    if (problemRef.current)
      problemRef.current.style.width = `${Math.max(
        80 * PX * 0.47,
        window.innerWidth * 0.47,
      )}px`;
  };
  const handleMouseDown = (event: { preventDefault: () => void; clientX: any; }) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (moveEvent: { clientX: any; }) => {
      const currentX = moveEvent.clientX;
      const dx = currentX - startX;
      const newWidth = startWidth + (dx / window.innerWidth * 100); // 창 너비에 대한 백분율로 계산
      setLeftWidth(Math.max(10, Math.min(90, newWidth))); // 10% ~ 90% 범위 내로 제한
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  return (
      <Wrapper>
        <HeaderWrapper>
          <ProblemHeader
              URL={
                roomNumber
                    ? `/problem/${version}/${id}/${roomNumber}`
                    : `/problem/${version}/${id}`
              }
              problemName={problem?.title ? problem.title : ''}
              type={0}
          />
        </HeaderWrapper>
        <MainWrapper>
          <div className="flex flex-row w-full p-4 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            {version === 'multi' && (
                <VideoContainer>
                  <Video />
                </VideoContainer>
            )}
            <div
                className="relative w-full h-full"
                style={{ display: 'flex', width: `${leftWidth}%` }}
            >
              <button
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 p-2 bg-white border border-gray-400 hover:bg-teal-100 focus:bg-white active:bg-white active:translate-y-1 active:shadow-inner font-medium text-center tracking-widest z-20"
                  onClick={() => setShowEditor(!showEditor)}
              >
                {showEditor ? '캔버스' : '에디터'}
              </button>
              <div
                  className="absolute inset-0 z-10 flex flex-col transition-opacity duration-1000 ease"
                  style={{
                    width: '100%',
                    opacity: showEditor ? 1 : 0,
                    visibility: showEditor ? 'visible' : 'hidden',
                  }}
              >
                <div
                    ref={editorRef}
                    className="relative flex-grow p-2 user-select-text overflow-auto mt-2.5"
                    style={{ flex: '0 0 60%' }} // 60% 고정
                >
                  {eView && (
                      <LanguageSelector
                          onClickModalElement={handleChangeEditorLanguage}
                      />
                  )}
                </div>
                <div
                    className="cursor-row-resize bg-gray-300 h-1 z-20"
                    onMouseDown={startResizing}
                    style={{ touchAction: 'none' }}
                ></div>
                <div style={{ flex: '0 0 40%' }} // 40% 고정
                >
                  <Result roomNumber={roomNumber} />
                </div>
              </div>

              <div
                  className="absolute inset-0 z-10 flex flex-col transition-opacity duration-1000 ease"
                  style={{
                    width: '100%',
                    opacity: showEditor ? 0 : 1,
                    visibility: showEditor ? 'hidden' : 'visible',
                  }}
              >
                <Canvas roomNumber={roomNumber} />
              </div>
            </div>

            <div
                onMouseDown={handleMouseDown}
                style={{
                  width: '10px',
                  backgroundColor: '#eef5f0',
                  cursor: 'ew-resize',
                  height: '100%',
                }}
            />

            <div
                className="flex-grow h-full flex flex-col min-w-1/4"
                style={{ width: `${100 - leftWidth}%` }}
            >
              <div className="w-full h-full overflow-auto">
                {problem && <ProblemContent problem={problem} />}
              </div>
            </div>
          </div>
        </MainWrapper>
      </Wrapper>
  );
};

export default Problem;