import React from 'react';
import styled from 'styled-components';
import ChattingSection from './ChattingSection';

interface ResultProps {
  roomNumber: string;
}

const ResultWrapper = styled.div`
  border: 2px double #cbcbcb;
  background: #f5fdf8;
  position: relative;
  height: 1080px;
  border-radius: 5px;
  margin: 0.9rem;
  overflow: auto;
`;

const Result: React.FC<ResultProps> = ({ roomNumber }) => {
  return (
      <ResultWrapper>
          <ChattingSection roomNumber={roomNumber} />
      </ResultWrapper>
  );
};

export default Result;
