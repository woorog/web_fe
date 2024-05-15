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
        <div
            className="flex flex-col items-center justify-center w-full p-4 bg-gray-100 shadow-lg h-96 overflow-y-auto">
            <ChattingSection roomNumber={roomNumber}/>
        </div>
    );
};

export default Result;
