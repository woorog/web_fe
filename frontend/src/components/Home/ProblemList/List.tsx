import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { userState } from '../../../recoils';
import { useRecoilState } from 'recoil';
import { ProblemInfo } from '@types';

const URL = import.meta.env.VITE_SERVER_URL;

const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: 1rem;
`;

const List = () => {
  const [user] = useRecoilState(userState);
  const [problems, setProblems] = useState<ProblemInfo[]>([]);
  useEffect(() => {
    const { ID } = user;
    const fetchURL = ID
      ? `${URL}/problem/random?loginId=${ID}`
      : `${URL}/problem/random?loginId=0`;
    fetch(fetchURL)
      .then((res) => res.json())
      .then((res) => {
        setProblems(Object.values(res));
      });
  }, [user]);
  return (
    <ListWrapper>
    </ListWrapper>
  );
};

export default List;
