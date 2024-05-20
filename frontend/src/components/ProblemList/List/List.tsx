import React from 'react';
import styled from 'styled-components';
import Problem from './Problem';
import { ProblemInfo } from '@types';
import { useRecoilState } from 'recoil';
import { filterState } from '../../../recoils';

type ListType = {
  list: ProblemInfo[];
};

const ListContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  padding: 0 5rem;
  flex-direction: column;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 0 2rem;
  }

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Info = styled.div`
  font-size: 1.3rem;
  color: #537744;
  margin: 3rem 0;
`;

const List = ({ list }: ListType) => {
  const [filter] = useRecoilState(filterState);

  const selectedProblem = list.length > 0 ? list[0] : null; // 첫 번째 문제를 선택

  return (
      <ListContainer>
        {selectedProblem && (
            <Problem key={selectedProblem.problemId} problem={selectedProblem} check={filter.check} />
        )}
      </ListContainer>
  );
};

export default List;