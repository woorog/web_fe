import React from 'react';
import styled from 'styled-components';
import ChattingSection from './ChattingSection';

interface ResultProps {
  roomNumber: string;
}

const Result: React.FC<ResultProps> = ({ roomNumber }) => {
    return (
        <div
            className="flex flex-col items-center justify-center w-full p-1 h-full overflow-y-auto">
            <ChattingSection roomNumber={roomNumber}/>
        </div>
    );
};

export default Result;
