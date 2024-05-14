
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
  min-width: 80rem;
  width: 180rem;
  margin: 0 auto;
  display: flex;
  padding: 0 5rem;
  flex-direction: column; // 자식 요소들을 세로로 정렬
`;

const Info = styled.div`
  font-size: 1.3rem;
  color: #537744;
  margin: 3rem 0;
`;

const List = ({ list }: ListType) => {
  const [filter] = useRecoilState(filterState);

  // 선택된 문제를 가져오는 로직
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

