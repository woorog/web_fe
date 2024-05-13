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

// const ProblemWrapper = styled.div`
//   width: 50%;
//   min-width: 15%;
//   height: auto;
//   padding: 1rem;
//   position: relative;
//
//   word-break: break-all;
//   overflow-x: hidden;
//   overflow-y: scroll;
//
//   ::-webkit-scrollbar {
//     width: 20px;
//   }
//
//   ::-webkit-scrollbar-track {
//     background-color: transparent;
//   }
//
//   ::-webkit-scrollbar-thumb {
//     background-color: #d6dee1;
//     border-radius: 20px;
//     border: 6px solid transparent;
//     background-clip: content-box;
//   }
//
//   ::-webkit-scrollbar-thumb:hover {
//     background-color: #a8bbbf;
//   }
// `;

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
  width: 70%; // Allocate remaining 70% width for problem content
  height: 100%; // Match the height of the ProblemWrapper
`;

export const EditorWrapper = styled.div`
  width: 100%;
  height: 65%;
  min-height: 10%;
  padding: 0.8rem;
  position: relative;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
  overflow: auto;

  .cm-editor.cm-focused {
    outline: none;
  }

  .cm-activeLine,
  .cm-activeLineGutter {
    background: none;
  }

  .cm-editor {
    border: 2px double #cbcbcb;
    background: #f5fdf8;
    border-radius: 5px;
    min-height: 95%;
  }
`;

export const ResultWrapper = styled.div`
  width: 100%;
  min-height: 10%;
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