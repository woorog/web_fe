import styled from 'styled-components';
import { ProblemType } from '@types';
import ProblemViewSection from './ProblemViewSection';

const ProblemContent = ({ problem }: ProblemType) => {
  if (!problem) return <></>;
  return (
      <div className="w-full bg-slate-200 h-full">
          <ProblemViewSection/>
      </div>
  );
};

export default ProblemContent;