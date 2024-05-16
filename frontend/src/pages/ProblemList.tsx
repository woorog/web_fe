import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { MainHeader } from '../components/MainHeader';
import { SearchFilter, List } from '../components/ProblemList';
import { Footer } from '../components/Footer';
import { filterState } from '../recoils';
import { ProblemInfo } from '@types';
import { userState } from '../recoils';

const URL = import.meta.env.VITE_SERVER_URL;

const ProblemList = () => {
  const [filter, setFilter] = useRecoilState(filterState);
  const [list, setList] = useState<ProblemInfo[]>([]);
  const [filtered, setFiltered] = useState<ProblemInfo[]>([]);
  const [user] = useRecoilState(userState);

  useEffect(() => {
    const { ID } = user;
    const fetchURL = ID ? `${URL}/problem?loginId=${ID}` : `${URL}/problem`;
    setFilter({
      solved: '푼 상태',
      level: '문제 레벨',
      search: '',
      check: false,
    });
    fetch(fetchURL)
      .then((res) => res.json())
      .then((res) => {
        setList(Object.values(res));
      });
  }, [user]);

  useEffect(() => {
    const { solved, level, search } = filter;
    let filtered = [...list];
    if (level && level !== '문제 레벨')
      filtered = filtered.filter((elem) => elem.level === +level.slice(-1));
    if (search && search !== '')
      filtered = filtered.filter((elem) => {
        if (elem.title)
          return elem.title.toUpperCase().includes(search.toUpperCase());
        else return false;
      });
    if (solved && solved !== '푼 상태')
      filtered = filtered.filter((elem) => {
        return solved === '푼 문제'
          ? elem.isSolved === true
          : elem.isSolved === false;
      });

    setFiltered(filtered);
  }, [filter, list]);

  return (
    <div className="flex flex-col items-center w-full min-w-[100rem] min-h-[100rem] bg-black text-white">
      <div className="w-full min-h-[8rem] h-[8rem] min-w-[100rem]">
        <MainHeader />
      </div>
      <SearchFilter />
      <div className="flex w-full h-[60rem]">
        <List list={filtered} />
      </div>
      <div className="w-full ">
        <Footer />
      </div>
    </div>
  );
};

export default ProblemList;