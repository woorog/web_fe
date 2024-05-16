/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageButtons, ProblemButtons } from '../components/Problem/Buttons';
import { ProblemHeader } from '../components/ProblemHeader';
import { ProblemContent, Result } from '../components/Problem';
import { ProblemInfo } from '@types';
import { useRecoilState } from 'recoil';
import { editorState, gradingState } from '../recoils';
import { Video } from '../components/Problem/Video';
import editorColors from '../utils/editorColors';
import LanguageSelector from '../components/Problem/LanguageSelector';
import defaultCodes from '../utils/defaultCode';
import * as Y from 'yjs';
import { yCollab } from 'y-codemirror.next';
import { WebrtcProvider } from 'y-webrtc';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState, Compartment } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import * as random from 'lib0/random';
import { useUserState } from '../hooks/useUserState';
import Canvas from '../components/Canvas/Canvas';
import '../../App.css';
import 'react-tiny-fab/dist/styles.css';
import MyFab from '../components/FloatingActionButton/MyFab';

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
      const currentHeight = editorRef.current.clientHeight;
      const newHeight = currentHeight + e.movementY;
      editorRef.current.style.height = `${newHeight}px`;
    }
  };

  const stopResize = () => {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  };

  const [leftWidth, setLeftWidth] = useState(50);
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
        ? new WebrtcProvider(roomNumber, ydoc, {
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
  const handleMouseDown = (event: {
    preventDefault: () => void;
    clientX: any;
  }) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (moveEvent: { clientX: any }) => {
      const currentX = moveEvent.clientX;
      const dx = currentX - startX;
      const newWidth = startWidth + (dx / window.innerWidth) * 100;
      setLeftWidth(Math.max(10, Math.min(90, newWidth)));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="w-full h-screen flex flex-col select-none">
      <div className="w-full h-16 box-border">
        <ProblemHeader
          URL={
            roomNumber
              ? `/problem/${version}/${id}/${roomNumber}`
              : `/problem/${version}/${id}`
          }
          problemName={problem?.title ? problem.title : ''}
          type={0}
        />
      </div>
      <div className="flex-grow w-full min-w-[80rem] h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex bg-[#eef5f0] border-2 border-groove border-[#dadada]">
        <MyFab />
        <div className="flex flex-row w-full p-4 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {version === 'multi' && (
            <div className="w-[30%] h-[85%]">
              <Video />
            </div>
          )}
          <div
            className="relative w-full h-full flex"
            style={{ width: `${leftWidth}%` }}
          >
            <button
              className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 p-2 bg-white border border-gray-400 hover:bg-teal-100 focus:bg-white active:bg-white active:translate-y-1 active:shadow-inner font-medium text-center tracking-widest z-20"
              onClick={() => setShowEditor(!showEditor)}
            >
              {showEditor ? '캔버스' : '에디터'}
            </button>
            <div
              className={`absolute inset-0 z-10 flex flex-col transition-opacity duration-1000 ease ${
                showEditor ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
              style={{
                width: '100%',
              }}
            >
              <div
                ref={editorRef}
                className="relative flex-grow p-2 user-select-text overflow-auto mt-2.5"
                style={{ flex: '0 0 60%' }}
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
              <div style={{ flex: '0 0 40%' }}>
                <Result roomNumber={roomNumber} />
              </div>
            </div>

            <div
              className={`absolute inset-0 z-10 flex flex-col transition-opacity duration-1000 ease ${
                showEditor ? 'opacity-0 invisible' : 'opacity-100 visible'
              }`}
              style={{
                width: '100%',
              }}
            >
              <Canvas roomNumber={roomNumber} />
            </div>
          </div>

          <div
            onMouseDown={handleMouseDown}
            className="w-[10px] bg-[#eef5f0] cursor-ew-resize h-full"
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
      </div>
    </div>
  );
};

export default Problem;
