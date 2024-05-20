import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../../../recoils';
import { useUserState } from '../../../hooks/useUserState';
import { texts } from './SolveList';
import uuid from 'react-uuid';

export const useProblemState = (problemId: number) => {
  const navigate = useNavigate();
  const [roomUrl, setRoomUrl] = useState('');
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * texts.length));
  const [fade, setFade] = useState('opacity-100');
  const [recentIndices, setRecentIndices] = useState<number[]>([]);
  const [user] = useRecoilState(userState);
  const { logoutHandler } = useUserState();
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(user.isLoggedIn);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFade('opacity-0');
      setTimeout(() => {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * texts.length);
        } while (recentIndices.includes(newIndex));

        setCurrentIndex(newIndex);
        setRecentIndices(prevIndices => {
          const newIndices = [...prevIndices, newIndex];
          return newIndices.length > 80 ? newIndices.slice(-80) : newIndices;
        });
        setFade('opacity-100');
      }, 1000);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [recentIndices]);

  const handleCreateRoom = () => {
    const room = btoa(uuid());
    localStorage.setItem(`problem${problemId}`, room);
    navigate(`/problem/multi/${problemId}/${room}`);
  };

  const handleJoinRoom = () => {
    if (roomUrl) {
      if (/^https?:\/\//.test(roomUrl)) {
        window.location.href = roomUrl;
      } else {
        navigate(roomUrl);
      }
    } else {
      alert('Please enter a valid room URL');
    }
  };

  const handleLogoutClick = useCallback(() => {
    if (!user.isLoggedIn) {
      return;
    }
    logoutHandler();
    setIsLoggedIn(false);
  }, [user.isLoggedIn, logoutHandler]);

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return {
    roomUrl,
    setRoomUrl,
    currentIndex,
    setCurrentIndex,
    fade,
    setFade,
    recentIndices,
    setRecentIndices,
    user,
    showSignup,
    setShowSignup,
    isLoggedIn,
    setIsLoggedIn,
    handleCreateRoom,
    handleJoinRoom,
    handleLogoutClick,
    handleSignupClick,
    handleLoginSuccess,
  };
};