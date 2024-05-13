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
    const isURL = value.match(/^(http(s)?:\/\/)[^\s@.][\w\s@.]+[.][^\s@.]+$/);

    if (!isURL && inputRef.current) {
      inputRef.current.placeholder = '잘못된 URL입니다!';
      onReset();
      setTimeout(() => {
        if (inputRef.current) inputRef.current.placeholder = '링크를 입력하세요';
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
    <ProblemSection>
      <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4">
        <form onSubmit={handleSubmit} className="w-full ">
          <input
            ref={inputRef}
            type="text"
            className="w-full p-2 border rounded-lg"
            value={ value }
            onChange={onChange}
            placeholder="링크를 입력하세요"
          />
        </form>
        {data && url ? <ProblemIframe htmlData={data} /> : <ClickToProblemInput handleClick={handleClick} error={error} />}
      </div>
    </ProblemSection>
  );
}

export default memo(ProblemViewSection);
