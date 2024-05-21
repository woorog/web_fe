// import React, { useState, useEffect } from 'react';
// import { useRecoilState } from 'recoil';
// import { MainHeader } from '../components/MainHeader';
// import { SearchFilter, List } from '../components/ProblemList';
// import { Footer } from '../components/Footer';
// import { filterState } from '../recoils';
// import { ProblemInfo } from '@types';
// import { userState } from '../recoils';

// const URL = import.meta.env.VITE_SERVER_URL;

// const ProblemList = () => {
//   const [filter, setFilter] = useRecoilState(filterState);
//   const [list, setList] = useState<ProblemInfo[]>([]);
//   const [filtered, setFiltered] = useState<ProblemInfo[]>([]);
//   const [user] = useRecoilState(userState);

//   useEffect(() => {
//     const { ID } = user;
//     const fetchURL = ID ? `${URL}/problem?loginId=${ID}` : `${URL}/problem`;
//     setFilter({
//       solved: '푼 상태',
//       level: '문제 레벨',
//       search: '',
//       check: false,
//     });
//     fetch(fetchURL)
//       .then((res) => res.json())
//       .then((res) => {
//         setList(Object.values(res));
//       });
//   }, [user]);

//   useEffect(() => {
//     const { solved, level, search } = filter;
//     let filtered = [...list];
//     if (level && level !== '문제 레벨')
//       filtered = filtered.filter((elem) => elem.level === +level.slice(-1));
//     if (search && search !== '')
//       filtered = filtered.filter((elem) => {
//         if (elem.title)
//           return elem.title.toUpperCase().includes(search.toUpperCase());
//         else return false;
//       });
//     if (solved && solved !== '푼 상태')
//       filtered = filtered.filter((elem) => {
//         return solved === '푼 문제'
//           ? elem.isSolved === true
//           : elem.isSolved === false;
//       });

//     setFiltered(filtered);
//   }, [filter, list]);

//   return (
//     <div className="flex flex-col items-center w-full min-h-screen bg-sublime-dark-grey-blue text-white">
//       <div className="w-full h-10">
//         <MainHeader />
//       </div>
//       <div className="w-full h-20">
//       </div>
//       <div className="flex flex-grow w-full overflow-auto">
//         <div className="w-full h-full flex flex-col">
//           <List list={filtered} />
//         </div>
//       </div>
//     </div>
//   );  
// };

// export default ProblemList;

import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { MainHeader } from '../components/MainHeader';
import { List } from '../components/ProblemList';
import { filterState } from '../recoils';
import { ProblemInfo } from '@types';
import { userState } from '../recoils';
import space from '../assets/space.mp4';

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
    <div className="relative w-full h-full overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={space}
        autoPlay
        loop
        muted
      />
      <div className="relative z-10 flex flex-col items-center w-full min-h-screen bg-sublime-dark-grey-blue bg-opacity-50 text-white">
        <div className="w-full h-21 z-20">
          <MainHeader />
        </div>
        <div className="flex flex-grow w-full items-center justify-between">
          <div className="flex-grow mx-2">
            <List list={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemList;
