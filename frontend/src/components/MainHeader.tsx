import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../recoils';
import React, { useCallback } from 'react';
import { useUserState } from '../hooks/useUserState';

export const MainHeader = () => {
  const [user, setUser] = useRecoilState(userState);
  const { logoutHandler } = useUserState();

  const handleLogoutClick = useCallback(() => {
    if (!user.isLoggedIn) {
      return;
    }
    logoutHandler();
  }, [user.isLoggedIn, logoutHandler]);

  return (
    <div className="flex items-center justify-between p-4 bg-black">
      <Link to="/" className="text-8xl font-bold text-white">
        Oncore
      </Link>
      <nav>
        <ul className="flex space-x-4">
        </ul>
      </nav>
      <div className="flex items-center space-x-2">
        {user.isLoggedIn ? (
          // 로그인 상태일 때 사용자 ID를 버튼 형식이 아닌 텍스트로 표시, 텍스트 크기 2배로 조정
          <span className="px-4 py-2 text-white text-2xl">{user.ID}</span>
        ) : (
          // 로그인 상태가 아닐 때 "회원가입" 버튼 표시, 텍스트 크기 2배로 조정
          <Link to="/signup">
            <button type="button" className="px-4 py-2 text-white border border-white bg-black hover:bg-gray-700 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-105 text-xl">
              회원가입
            </button>
          </Link>
        )}
        {user.isLoggedIn && (
          // 로그인 상태일 때만 "로그아웃" 버튼 표시, 텍스트 크기 2배로 조정
          <button type="button" onClick={handleLogoutClick} className="px-4 py-2 text-white border border-white bg-black hover:bg-gray-700 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-105 text-xl">
            로그아웃
          </button>
        )}
        {!user.isLoggedIn && (
          // 로그인 상태가 아닐 때 "로그인" 버튼 표시, 텍스트 크기 2배로 조정
          <Link to="/signin">
            <button type="button" className="px-4 py-2 text-white border border-white bg-black hover:bg-gray-700 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-105 text-xl">
              로그인
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
