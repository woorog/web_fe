import styled from 'styled-components';
import { ProblemType } from '@types';
import ProblemViewSection from './ProblemViewSection';

const ContentWrapper = styled.div`
  border: 3px double #cbcbcb;
  border-radius: 5px;
  width: 100%;
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f5fdf8;
  height: fit-content;
  min-height: 75%;
`;

const ProblemContent = ({ problem }: ProblemType) => {
  if (!problem) return <></>;
  return (
    <>
      <ContentWrapper>
        <ProblemViewSection/>
      </ContentWrapper>
    </>
  );
};

export default ProblemContent;