import {
  HeaderContainer,
  AnchorLogo,
  GreenMark,
  MenuContainer,
} from '../styles/ProblemHeader.style';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../recoils';
import React, { useCallback } from 'react';
import { ReactComponent as Greater } from '../assets/Greater.svg';
import { useUserState } from '../hooks/useUserState';
import {PageButtons} from "./Problem/Buttons";

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
    <HeaderContainer>
      <AnchorLogo to={'/'}>OnCore</AnchorLogo>
      <div>
        <ul>
          <li>
            <PageButtons />
          </li>
        </ul>
      </div>
      <MenuContainer>
        <Link to={user.isLoggedIn ? '' : '/signup'}>
          <button type={'button'}>
            {user.isLoggedIn ? user.ID : '회원가입'}
          </button>
        </Link>
        <Link to={user.isLoggedIn ? '' : '/signin'}>
          <button type={'button'} onClick={handleLogoutClick}>
            {user.isLoggedIn ? '로그아웃' : '로그인'}
          </button>
        </Link>
      </MenuContainer>
    </HeaderContainer>
  );
};
