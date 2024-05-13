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
// CSS in JS
import { Wrapper, HeaderWrapper, MainWrapper, PageButtonsWrapper, ProblemWrapper,
  SolvingWrapper, VideoContainer, EditorWrapper, ResultWrapper, ButtonsWrapper,
  ColSizeController, RowSizeController, ContentContainer,
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
  const navigate = useNavigate();
  const [moveColResize, setMoveColResize] = useState(false);
  const [moveRowResize, setMoveRowResize] = useState(false);
  const [, setGrade] = useRecoilState(gradingState);
  const [, setEState] = useState<EditorState>();
  const [eView, setEView] = useState<EditorView>();
  const [problem, setProblem] = useState<ProblemInfo>();
  const { id, version } = useParams();
  const [isMultiVersion] = useState(version === 'multi');
  const [code, setCode] = useRecoilState(editorState);
  const [language, setLanguage] = useState(code.language);
  const [text, setText] = useState(code.text);
  const [param, setParam] = useState(1);
  const { roomNumber } = isMultiVersion ? useParams() : { roomNumber: null };
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

  const handleClickClearButton = () => {
    if (eView) {
      let insertCode;
      const { text: priorText, language: priorLanguage } = code;
      saveCode(priorText, priorLanguage);
      if (language === '' || language === 'JavaScript' || language === 'Python')
        insertCode = defaultCode[language];
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

  const resizeProblemWrapper = (x: number) => {
    if (problemRef.current != null && editorRef.current != null) {
      const problemRefWidth = +problemRef.current.style.width.replace('px', '');
      +editorRef.current.style.maxWidth.replace('px', '');
      const PX = +REM.replace('px', '');
      if (x > 0.175 * window.innerWidth)
        problemRef.current.style.width = `${Math.max(
          80 * PX * 0.15,
          x - window.innerWidth * 0.032,
        )}px`;
      const editorWidth = Math.max(
        80 * PX * 0.95 - problemRefWidth,
        window.innerWidth * 0.96 - problemRefWidth,
      );
      editorRef.current.style.width = `${editorWidth}px`;
      editorRef.current.style.maxWidth = `${editorWidth}px`;
      editorRef.current.style.minWidth = `${Math.max(
        80 * PX * 0.25,
        window.innerWidth * 0.25,
      )}px`;
    }
  };

  const resizeEditorWrapper = (y: number) => {
    if (editorRef.current != null) {
      const PX = +REM.replace('px', '');
      editorRef.current.style.height = `${
        y - PX * 4 - window.innerWidth * 0.008
      }px`;
    }
  };

  const mainEventHandler = {
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => {
      if (moveColResize) resizeProblemWrapper(e.clientX);
      else if (moveRowResize) resizeEditorWrapper(e.clientY);
    },
    onMouseUp: () => {
      setMoveColResize(false);
      setMoveRowResize(false);
    },
    onMouseLeave: () => {
      setMoveColResize(false);
      setMoveRowResize(false);
    },
  };

  const handleColSizeController = {
    onMouseDown: () => {
      setMoveColResize(true);
    },
  };

  const handleRowSizeController = {
    onMouseDown: () => {
      setMoveRowResize(true);
    },
  };

  return (
    <Wrapper {...mainEventHandler}>
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
        <PageButtonsWrapper>
          <PageButtons />
        </PageButtonsWrapper>
        <ProblemWrapper ref={problemRef}>
          {version === 'multi' && (
            <VideoContainer>
              <Video />
            </VideoContainer>
          )}
          {/*여기부분에  <ContentContainer>  <VideoContainer>  둘 사이의 간격을 조절할수있게 만들어줘 */}
          <ContentContainer>
            {problem && <ProblemContent problem={problem} />}
          </ContentContainer>
        </ProblemWrapper>
        <ColSizeController {...handleColSizeController}></ColSizeController>
        <SolvingWrapper>
          <EditorWrapper ref={editorRef}>
            < Canvas />
          </EditorWrapper>

          <EditorWrapper ref={editorRef}>
            {eView && (
              <LanguageSelector
                onClickModalElement={handleChangeEditorLanguage}
              />
            )}
          </EditorWrapper>
          <RowSizeController {...handleRowSizeController}></RowSizeController>
          <ResultWrapper>
            <Result roomNumber={roomNumber} />
          </ResultWrapper>
          <ButtonsWrapper>
            <ProblemButtons onClickClearBtn={handleClickClearButton} />
          </ButtonsWrapper>
        </SolvingWrapper>
      </MainWrapper>
    </Wrapper>
  );
};

export default Problem;
