import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userState } from '../recoils';
import PageButtons from '../components/Problem/Buttons/PageButtons';
import { ProblemHeader } from '../components/ProblemHeader';
import { ProblemContent} from '../components/Problem';
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
import axios from 'axios';
import { io } from 'socket.io-client';
import '../../App.css';
import { ReactComponent as Comment } from '../assets/Comment.svg'; // SVG 아이콘 임포트
import { ReactComponent as NewMessage } from '../assets/Message-dot.svg'; // 클로즈 아이콘 SVG 임포트
import ChattingSection from '../components/Problem/ChattingSection'; // ChattingSection 임포트


const URL = import.meta.env.VITE_SERVER_URL;
const socketURL = import.meta.env.VITE_SOCKET_RESULT_URL;
const REM = getComputedStyle(document.documentElement).fontSize;
const webRTCURL = import.meta.env.VITE_SOCKET_URL;

const languageCompartment = new Compartment();

const langs = {
  JavaScript: javascript(),
  Python: python(),
};

interface EditorCanvasToggleProps {
  isVisible: boolean;
  toggleVisibility: () => void;
  label: string;
}

const EditorCanvasToggle: React.FC<EditorCanvasToggleProps> = ({ isVisible, toggleVisibility, label }) => {
  return (
    <button
      className={`w-1/2 ${
        isVisible ? 'border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-600 dark:bg-sublime-yellow dark:border-gray-700 dark:text-black' : 'border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex justify-center items-center dark:focus:ring-gray-600 dark:bg-sublime-dark-grey-blue dark:border-gray-700 dark:text-white dark:hover:bg-gray-700'
      } `}
      onClick={toggleVisibility}
    >
      {label}
    </button>
  );
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
  editorContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  },
  editorTop: {
    flex: '2',
    overflow: 'auto',
    padding: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    position: 'relative',
  },
  editorBottom: {
    flex: '1',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    marginTop: '0.5rem',
    height: '100%',
  },
  inputButtonWrapper: {
    flexBasis: '33.33%',
    display: 'flex',
    flexDirection: 'column',
  },
  textArea: {
    flex: '1',
    margin: '0 0.25rem',
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '0.5rem',
    height: '100%',
  },
  runButton: {
    padding: '0.5rem',
    backgroundColor: '#303841',
    color: 'white',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  resultSectionVisible: {
    display: 'block',
  },
};


const combinedTheme = EditorView.theme({
  ".cm-content": {
    letterSpacing: "0.06em" // 글자 간 간격 설정
  },
  "&": {
    backgroundColor: "white",
  }
}, { dark: false });


const Problem = () => {
  useUserState();

  const [leftWidth, setLeftWidth] = useState(55); // 초기 왼쪽 패널 너비 (퍼센트)
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);
  const [isResultVisible, setIsResultVisible] = useState(false);
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLTextAreaElement>(null);
  const [isRecievedMessage, setIsRecievedMessage] = useState(false);
  const socket = useMemo(() => {
    const newSocket = io(socketURL, {
      path: '/socket-result/',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    return newSocket;
  }, []);



  const handleToggleEditor = () => {
    setIsEditorVisible(true);
    setIsCanvasVisible(false);
  };

  const handleToggleCanvas = () => {
    setIsEditorVisible(false);
    setIsCanvasVisible(true);
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
      combinedTheme,
      // syntaxHighlighting(myHighlightStyle),
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

  useEffect(() => {
    socket.emit('join-room', roomNumber);

    socket.on('receive-result', (result) => {
      if (resultRef.current) {
        resultRef.current.value = result;
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

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

  const handleRunCode = async() => {
    if (eView) {
      const versionMap: { [key: string]: string } = {
        python: '3.10.0',
        javascript: '18.15.0',
      };
      const pistonUrl = 'https://emkc.org/api/v2/piston/execute'
      const language = (code.language).toString().toLowerCase();
      const version = versionMap[language];
      const codeContent = eView.state.doc.toString();
      const inputText = inputRef.current ? inputRef.current.value : '';
      let payload = {};
      if(language == 'python') {
        payload = {
          language: language,
          version: version,
          files: [
            {
                content: codeContent,
            },
          ],
          stdin: inputText,
        };
      } else {
        payload = {
          language: language,
          version: version,
          files: [
            {
                name: 'index.js',
                content: codeContent,
            },
          ],
          stdin: inputText,
          args: [],
        };
      }

      try {
        const response = await axios.post(pistonUrl, payload);
        let result = `${response.data.run.output}`
        if (resultRef.current) {
          resultRef.current.value = result;
        }
        socket.emit('send-result', roomNumber, result);
      } catch (error) {
        if (resultRef.current) {
          resultRef.current.value = "Error Executing Code";
        }
        socket.emit('send-result', roomNumber, "Error Executing Code");
      }
    }
  };

  const handleNewMessage = () => {
    if (!isResultVisible) {
      // 채팅창이 열려 있지 않은 경우에만 업데이트
      setIsRecievedMessage(true);
    }
  };

  const handleToggleChat = () => {
    setIsResultVisible((prev) => !prev);
    setIsRecievedMessage(false); // 채팅창이 열려 있으면 새로운 메시지가 와도 아이콘이 변경되지 않음
  };


  return (
    <div className="w-full h-screen mx-auto flex flex-col select-none">
      <div className="w-full h-16 bg-sublime-dark-grey-blue box-border">
        <ProblemHeader
          URL={roomNumber ? `/problem/${version}/${id}/${roomNumber}` : `/problem/${version}/${id}`}
          problemName={problem?.title ? problem.title : ''}
          type={0}
        />
      </div>
      <div className="flex-grow w-full flex flex-col bg-slate-200">
        <div
          className="flex flex-row w-full h-full p-4 overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {version === 'multi' && (
            <div className="relative w-1/7 h-full">
              <div className="w-full mb-2">
                <PageButtons />
              </div>
              <div className="w-full">
                <Video />
              </div>
            </div>
          )}
          <div className="relative h-full flex flex-col px-4" style={{ width: `${leftWidth}%` }}>
            <div className="flex w-full mb-2 space-x-2">
              <EditorCanvasToggle
                isVisible={isEditorVisible}
                toggleVisibility={handleToggleEditor}
                label="코드에디터"
              />
              <EditorCanvasToggle
                isVisible={isCanvasVisible}
                toggleVisibility={handleToggleCanvas}
                label="화이트보드"
              />
            </div>
            <div style={styles.flipCard}>
              <div
                style={{
                  ...styles.flipCardInner,
                  ...(isCanvasVisible ? styles.flipCardInnerFlipped : {}),
                }}
              >
                <div style={styles.flipCardFrontBack} className="drop-shadow-lg rounded-lg">
                  <div style={styles.editorContainer}>
                    <div
                      ref={editorRef}
                      className="relative flex-grow select-text overflow-auto mt-2.5 rounded-lg"
                      style={styles.editorTop}
                    >
                      {eView && (
                        <LanguageSelector onClickModalElement={handleChangeEditorLanguage} />
                      )}
                    </div>
                    <div style={styles.editorBottom}>
                      <div style={styles.inputButtonWrapper}>
                        <textarea
                          ref={inputRef}
                          style={styles.textArea}
                          placeholder="Input"
                        />
                        <button
                          style={styles.runButton}
                          onClick={handleRunCode}
                        >
                          Run
                        </button>
                      </div>
                      <textarea
                        ref={resultRef}
                        style={{ ...styles.textArea, flexBasis: '66.67%', backgroundColor: 'rgb(209 213 219)' }} // Tailwind's grey-300
                        placeholder="Result"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div style={{ ...styles.flipCardFrontBack, ...styles.flipCardBack, padding: '0.5rem' }}>
                  <Canvas roomNumber={roomNumber} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow h-full flex flex-col min-w-1/4" style={{ width: `${100 - leftWidth}%` }}>
            {problem && <ProblemContent problem={problem} />}
          </div>
        </div>
      </div>
  
      <div
        className={`icon-container fixed top-1 right-2 ${isResultVisible ? 'icon-partially-visible' : (isRecievedMessage ? 'icon-fully-visible' : 'icon-partially-visible')}`}
        onClick={handleToggleChat}
      >
        {isResultVisible ? <NewMessage className="icon icon-white" /> : (isRecievedMessage ?
          <NewMessage className="icon icon-orange" /> :
          <NewMessage className="icon icon-white" />)}
      </div>

      <div
        className={`fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-4 shadow-lg overflow-y-auto ${
          isResultVisible ? 'block' : 'hidden'
          }`}
        style={{ width: '41.666667%', height: '70vh' }}
      >
        <ChattingSection roomNumber={roomNumber} onNewMessage={handleNewMessage} />
      </div>
    </div>
  );
};

export default Problem;
