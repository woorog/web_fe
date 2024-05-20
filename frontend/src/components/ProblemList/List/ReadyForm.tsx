import React from 'react';

interface ReadyFormProps {
  roomUrl: string;
  setRoomUrl: React.Dispatch<React.SetStateAction<string>>;
  handleJoinRoom: () => void;
  handleCreateRoom: () => void;
  handleLogoutClick: () => void;
}

const ReadyForm: React.FC<ReadyFormProps> = ({
  roomUrl,
  setRoomUrl,
  handleJoinRoom,
  handleCreateRoom,
  handleLogoutClick,
}) => {
  const buttonStyle = {
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
    transition: 'box-shadow 0.3s ease-in-out',
    boxShadow: '0 0 2px #ffffff',
    fontWeight: 'bold',
    fontSize: '1.25rem', // text-xl 크기 적용
  };

  const buttonHoverStyle = {
    boxShadow: '0 0 10px #ffffff',
  };

  return (
    <div className="flex flex-col items-center w-3/5 max-w-screen-md space-y-5 mt-5 p-6 rounded-lg" style={{ backgroundColor: '#303841' }}>
      <div className="flex w-full space-x-2">
        <input
          type="text"
          placeholder="방 URL을 입력해 참가하세요"
          value={roomUrl}
          onChange={(e) => setRoomUrl(e.target.value)}
          className="flex-grow h-12 p-2 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 text-black bg-white"
        />
        <button
          onClick={handleJoinRoom}
          className="relative bg-black text-white py-3 px-6 rounded-lg border-2 border-white transition duration-300"
          style={buttonStyle}
          onMouseOver={(e) => (e.currentTarget.style.boxShadow = buttonHoverStyle.boxShadow)}
          onMouseOut={(e) => (e.currentTarget.style.boxShadow = buttonStyle.boxShadow)}
        >
          방 참가하기
          <span className="absolute inset-0 rounded-lg border border-transparent transition-all duration-300 hover:border-white hover:shadow-outline" style={{ boxShadow: '0 0 10px #ffffff' }}></span>
        </button>
      </div>
      <button
        onClick={handleCreateRoom}
        className="relative bg-black text-white py-3 px-6 rounded-lg border-2 border-white transition duration-300 mt-10"
        style={buttonStyle}
        onMouseOver={(e) => (e.currentTarget.style.boxShadow = buttonHoverStyle.boxShadow)}
        onMouseOut={(e) => (e.currentTarget.style.boxShadow = buttonStyle.boxShadow)}
      >
        방 만들기
        <span className="absolute inset-0 rounded-lg border border-transparent transition-all duration-300 hover:border-white hover:shadow-outline" style={{ boxShadow: '0 0 10px #ffffff' }}></span>
      </button>
      <button
        type="button"
        onClick={handleLogoutClick}
        className="relative bg-black text-white py-3 px-6 rounded-lg border-2 border-white transition duration-300 mt-5"
        style={buttonStyle}
        onMouseOver={(e) => (e.currentTarget.style.boxShadow = buttonHoverStyle.boxShadow)}
        onMouseOut={(e) => (e.currentTarget.style.boxShadow = buttonStyle.boxShadow)}
      >
        로그아웃
        <span className="absolute inset-0 rounded-lg border border-transparent transition-all duration-300 hover:border-white hover:shadow-outline" style={{ boxShadow: '0 0 10px #ffffff' }}></span>
      </button>
    </div>
  );
};

export default ReadyForm;