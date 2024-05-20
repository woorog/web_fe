import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../recoils';
import { useCallback } from 'react';
import { useUserState } from '../hooks/useUserState';
import logo from '../assets/TransparentBanner.png';

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
    <div className="flex items-center justify-between p-2 bg-transparent">
      <Link to="/" className="text-7xl font-bold text-white">
        <img src={logo} alt="ONCORE" className="h-24" />
      </Link>
      <nav>
        <ul className="flex space-x-4">
        </ul>
      </nav>
      <div className="flex items-center space-x-2">
        {user.isLoggedIn ? (
          <span className="px-4 py-2 text-white text-2xl">{user.ID}</span>
        ) : (
          <Link to="/signup">
            <button type="button" className="px-4 py-2 text-white border border-white bg-sublime-dark-grey-blue hover:bg-gray-800 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-105 text-xl">
              회원가입
            </button>
          </Link>
        )}
        {user.isLoggedIn && (
          <button type="button" onClick={handleLogoutClick} className="px-4 py-2 text-white border border-white bg-sublime-dark-grey-blue hover:bg-gray-800 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-105 text-xl">
            로그아웃
          </button>
        )}
        {!user.isLoggedIn && (
          <Link to="/signin">
            <button type="button" className="px-4 py-2 text-white border border-white bg-sublime-dark-grey-blue hover:bg-gray-800 focus:outline-none transition-transform duration-300 ease-in-out transform hover:scale-105 text-xl">
              로그인
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
