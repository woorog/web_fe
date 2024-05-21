// TextComponent.tsx
import React from 'react';
import { texts } from './SolveList';

type TextComponentProps = {
  fade: string;
  currentIndex: number;
  showSignup: boolean;
};

const TextComponent = ({ fade, currentIndex, showSignup }: TextComponentProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-transparent pt-0 pb-0 px-0">
      {/* <div className={`flex flex-col items-center justify-center w-full max-w-screen-lg ${showSignup ? 'mb-0' : 'mb-5 md:mb-10 lg:mb-20'} px-0`}> */}
      <div className={`flex flex-col items-center justify-center w-full max-w-screen-lg px-0`}>
        <div className={`${fade} transition-opacity duration-1000 text-center px-0`}>
          {texts[currentIndex].kr.split('\n').map((line: string, index: number) => (
            <p key={index} className="text-2xl sm:text-6xl md:text-9xl lg:text-12xl text-white font-bold" style={{ whiteSpace: 'nowrap' }}>
              {line}
            </p>
          ))}
          <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4.5xl text-gray-500 font-bold" style={{ whiteSpace: 'nowrap' }}>
            {texts[currentIndex].en}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextComponent;