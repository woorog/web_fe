import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userState } from '../recoils';
import { ProblemButtons } from '../components/Problem/Buttons';
import PageButtons from '../components/Problem/Buttons/PageButtons';
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

const URL = import.meta.env.VITE_SERVER_URL;
const REM = getComputedStyle(document.documentElement).fontSize;
const webRTCURL = import.meta.env.VITE_SOCKET_URL;

const languageCompartment = new Compartment();

const langs = {
  JavaScript: javascript(),
  Python: python(),
};

const styles = {
  flipCard: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    perspective: '1000px',
  },
  flipCardInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transition: 'transform 0.8s',
    transformStyle: 'preserve-3d',
  },
  flipCardInnerFlipped: {
    transform: 'rotateY(180deg)',
  },
  flipCardFrontBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  flipCardBack: {
    transform: 'rotateY(180deg)',
  },
};

const whiteBackgroundTheme = EditorView.theme({
  "&": {
    backgroundColor: "white",
  }
}, { dark: false });

const Problem = () => {
  useUserState();

  const [leftWidth, setLeftWidth] = useState(50); // 초기 왼쪽 패널 너비 (퍼센트)
  const [showEditor, setShowEditor] = useState(true);
  const [showResult, setShowResult] = useState(true);
  const [user] = useRecoilState(userState);
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

  const [isFlippedRight, setIsFlippedRight] = useState(false);
  const [isFlippedLeft, setIsFlippedLeft] = useState(true);
  const handleFlipRight = () => {
    setIsFlippedRight(!isFlippedRight);
  };
  const handleFlipLeft = () => {
    setIsFlippedLeft(!isFlippedLeft);
  };

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
        name: user.ID,
        color: userColor.color,
        colorLight: userColor.light,
      });
  
    const languageExtension = languageCompartment.of(langs['JavaScript']);
  
    const extensions = [
      basicSetup,
      keymap.of([indentWithTab]),
      languageExtension,
      whiteBackgroundTheme,
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
    <div className="w-full h-screen mx-auto flex flex-col select-none">
      <div className="w-full h-16 bg-sublime-dark-grey-blue box-border">
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
      <div className="flex-grow w-full flex flex-col bg-slate-200">
        <div className="flex flex-row w-full h-full p-4 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {version === 'multi' && (
            <div className="relative w-1/6 h-full">
              <div className="w-full mb-2">
              <PageButtons />
              </div>
              <div className="w-full">
                <Video />
              </div>
            </div>
          )}
          <div className="relative h-full flex flex-col px-4" style={{ width: `${leftWidth}%` }}>
            <button
              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-600 dark:bg-sublime-dark-grey-blue dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
              onClick={handleFlipLeft}
            >
              {isFlippedLeft ? '화이트보드' : '코드에디터'}
            </button>
            <div style={styles.flipCard}>
              <div
                style={{
                  ...styles.flipCardInner,
                  ...(isFlippedLeft ? styles.flipCardInnerFlipped : {}),
                }}
              >
                <div style={styles.flipCardFrontBack}>
                  <div
                    ref={editorRef}
                    className="relative flex-grow p-2 select-text overflow-auto mt-2.5"
                    style={{ flex: '1 1 auto' }}
                  >
                    {eView && (
                      <LanguageSelector onClickModalElement={handleChangeEditorLanguage} />
                    )}
                  </div>
                </div>
                <div style={{ ...styles.flipCardFrontBack, ...styles.flipCardBack, padding: '0.5rem' }}>
                  <Canvas roomNumber={roomNumber} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow h-full flex flex-col min-w-1/4" style={{ width: `${100 - leftWidth}%` }}>
            <button
              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-600 dark:bg-sublime-dark-grey-blue dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
              onClick={handleFlipRight}
            >
              {isFlippedRight ? '문제' : '채팅'}
            </button>
            <div style={styles.flipCard}>
              <div
                style={{
                  ...styles.flipCardInner,
                  ...(isFlippedRight ? styles.flipCardInnerFlipped : {}),
                }}
              >
                <div style={styles.flipCardFrontBack}>
                  <Result roomNumber={roomNumber} />
                </div>
                <div style={{ ...styles.flipCardFrontBack, ...styles.flipCardBack }}>
                  {problem && <ProblemContent problem={problem} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
