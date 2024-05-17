import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

export const HeaderWrapper = styled.div`
  width: 100%;
  height: 4rem;
  box-sizing: border-box;
`;

export const MainWrapper = styled.div`
  height: calc(100vh - 5rem);
  min-width: 80rem;
  max-height: calc(100vh - 5rem);
  width: 100%;
  flex-grow: 1;
  border: 2px groove #dadada;
  display: flex;
  background: #eef5f0;
`;

export const PageButtonsWrapper = styled.div`
  height: 100%;
  width: 2.5%;
  padding-top: 3rem;
`;

export const ProblemWrapper = styled.div`
  display: flex;
  flex-direction: row; // Align children side by side
  width: 100%;
  padding: 1rem;
  overflow-x: hidden; // Handle overflowing content
  overflow-y: auto; // Allow vertical scrolling

  ::-webkit-scrollbar {
    width: 20px;
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #a8bbbf;
  }
`;

export const SolvingWrapper = styled.div`
  flex-grow: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 25%;
`;

export const VideoContainer = styled.div`
  width: 30%; // Allocate 30% width for the video
  height: 85%; // Match the height of the ProblemWrapper
`;

export const ContentContainer = styled.div`
    width: 100%; // Allocate 30% width for the video
    height: 85%; // Match the height of the ProblemWrapper
`;

export const CompilerContainer = styled.div`
    width: 100%; // Allocate 30% width for the video
    height: 25%; // Match the height of the ProblemWrapper
`;


export const EditorWrapper = styled.div`
    width: 100%;  // 부모 컨테이너의 너비에 맞춤
    height: calc(100% - 2rem);  // 부모의 높이에서 2rem 만큼 빼고 사용
    min-height: 10%;  // 최소 높이 설정
    padding: 0.8rem;
    position: relative;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    overflow: auto;
    
`;

export const ResultWrapper = styled.div`
  width: 100%;
  height: 70%;
  flex-grow: 1;
`;

export const ButtonsWrapper = styled.div`
  height: 6%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const ColSizeController = styled.div`
  height: 100%;
  width: 1%;
  cursor: col-resize;
  background: #dce2de;
`;

export const RowSizeController = styled.div`
  width: 100%;
  height: 1vw;
  cursor: row-resize;
  background: #dce2de;
`;