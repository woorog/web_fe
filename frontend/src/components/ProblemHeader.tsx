import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../recoils';
import React, { useCallback } from 'react';
import { useUserState } from '../hooks/useUserState';
import logo from '../assets/TransparentBanner.png';

interface propsType {
  URL: string;
  problemName: string;
  type: number;
  roomNumber?: string;
}

export const ProblemHeader = ({ URL, problemName, type }: propsType) => {
  const [user, setUser] = useRecoilState(userState);
  const { logoutHandler } = useUserState();
  const handleLogoutClick = useCallback(
    (/*e: React.MouseEvent<HTMLButtonElement>*/) => {
      if (!user.isLoggedIn) {
        return;
      }
      logoutHandler();
    },
    [user, setUser, user.isLoggedIn],
  );

  return (
    <div className="box-border w-full px-24 h-full flex justify-between items-center">
      <Link to="/" className="text-7xl font-bold text-white">
        <img src={logo} alt="ONCORE" className="h-16" />
      </Link>
      <div className="flex justify-center items-center h-full">
        <div className="flex gap-4">
          <div className="text-white font-medium text-sm px-5 py-2.5">
            {user.ID}
          </div>
          {/* <Link to={user.isLoggedIn ? '' : '/signin'}>
            <button
              type="button"
              onClick={handleLogoutClick}
              className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 me-2 mb-2"
            >
              {user.isLoggedIn ? '로그아웃' : '로그인'}
            </button>
          </Link> */}
        </div>
      </div>
    </div>
  );
};
