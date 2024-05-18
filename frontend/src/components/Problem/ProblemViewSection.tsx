import React, { useState, useRef, memo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import getProblemData from '../../apis/getProblemData';
import ClickToProblemInput from './ProblemComponents/ClickToProblemInput';
import ErrorView from './ProblemComponents/ErrorView';
import ProblemIframe from './ProblemComponents/ProblemIframe';
import Loading from './ProblemComponents/Loading';
import ProblemSection from './ProblemComponents/ProblemSection';
import useInput from '../../hooks/useInput';

function ProblemViewSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setURL] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS, url],
    queryFn: () => getProblemData(url),
    enabled: !!url
  });
  const { value, onChange, onReset } = useInput(url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const inputNumber = Number(value);
    const isValidNumber = !isNaN(inputNumber) && inputNumber >= 1000 && inputNumber <= 31900;

    if (!isValidNumber && inputRef.current) {
      inputRef.current.placeholder = '백준 문제 번호는 [1000 ~ 31900] 까지 있습니다';
      onReset();
      setTimeout(() => {
        if (inputRef.current)
          inputRef.current.placeholder = '백준 문제 번호를 입력하세요 [1000 ~ 31900]';
      }, 1000);
      return;
    }

    if (!value) return;

    setURL(value);
  };

  const handleClick = () => {
    inputRef.current?.focus();
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorView error={error} />;

  return (
      <div className="flex flex-col w-full h-full max-w-4xl mx-auto p-1 drop-shadow-lg">  {/* h-full 추가하여 높이를 부모에 맞춤 */}
        <ProblemSection>
          <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4"> {/* 여기서도 h-full 추가 */}
            <form onSubmit={handleSubmit} className="w-full">
              <input
                  ref={inputRef}
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  value={value}
                  onChange={onChange}
                  placeholder="백준 문제를 입력하세요"
              />
            </form>
            {data && url ? <ProblemIframe htmlData={data}/> :
                <ClickToProblemInput handleClick={handleClick} error={error}/>}
          </div>
        </ProblemSection>
      </div>
  );
}

export default memo(ProblemViewSection);
