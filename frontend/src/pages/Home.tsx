import React from 'react';
import { List } from '../components/Home';
import { MainHeader } from '../components/MainHeader';
import { Footer } from '../components/Footer';
import { useUserState } from '../hooks/useUserState';

const Main = () => {
  useUserState();
  return (
    <div className="w-full min-w-[80rem] h-fit-content mx-auto flex flex-col items-center">
      <div className="min-w-[80rem] w-[80rem] min-h-[8rem] h-[8rem]">
        <MainHeader></MainHeader>
      </div>
      {/* <div className="w-full h-[15rem] overflow-hidden relative">
        <Banner></Banner>
      </div> */}
      <div className="min-w-[80rem] w-[80rem] h-[55rem]">
        <List></List>
      </div>
      <div className="min-w-[80rem] w-[80rem] min-h-[15rem] h-[15rem]">
        <Footer />
      </div>
    </div>
  );
};

export default Main;