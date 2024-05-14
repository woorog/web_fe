import styled from 'styled-components';

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
export const VideoContainer = styled.div`
  width: 20%; // Allocate 30% width for the video
  height: 85%; // Match the height of the ProblemWrapper
`;


