import React, { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import uuid from 'react-uuid';

type ProblemProps = {
  problemId: number;
};

const Problem = ({ problemId }: ProblemProps) => {
  const navigate = useNavigate();
  const [roomUrl, setRoomUrl] = useState('');

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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center w-full max-w-4xl px-8 py-10 bg-white bg-opacity-80 shadow-lg rounded-xl">
        <div className="w-full">
          <input
            type="text"
            placeholder="방 URL을 입력해 참가하세요"
            value={roomUrl}
            onChange={(e) => setRoomUrl(e.target.value)}
            className="w-full h-12 p-2 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 text-black bg-white"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-full mt-5 space-y-5">
          <button
            onClick={handleJoinRoom}
            className="w-1/2 h-12 text-base sm:text-lg font-bold text-white bg-sublime-light-turquoise rounded-lg hover:bg-[#82c4c4] shadow-lg transition duration-300"
          >
            방 참가하기
          </button>
          <button
            onClick={handleCreateRoom}
            className="w-1/2 h-12 text-base sm:text-lg font-bold text-white bg-sublime-dark-grey-blue rounded-lg hover:bg-gray-500 shadow-lg transition duration-300"
          >
            방 만들기
          </button>
        </div>
      </div>
    </div>
  );
};
export default memo(Problem);