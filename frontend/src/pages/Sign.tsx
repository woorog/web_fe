// import { Footer } from '../components/Footer';
// import React from 'react';
// import { SignupInputForm } from '../components/SignUp/InputForm';
// import { SigninInputForm } from '../components/SignIn/InputForm';
// import { useLocation, useNavigate } from 'react-router-dom';

// export const Sign = () => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();

//   const goHome = () => navigate('/'); // Adjust this path according to your home route

//   return (
//     <div className="w-full h-screen m-auto flex flex-col items-center bg-sublime-dark-grey-blue text-white">
//       <button
//         className="mt-8 mb-4 inline-flex items-center justify-center p-1.5 text-lg font-bold text-white bg-sublime-dark-grey-blue rounded-lg border-2 border-white transition-all ease-in duration-300 hover:bg-white hover:text-black"
//         onClick={goHome}
//       >
//         <span className="relative px-6 py-3 rounded-md text-white hover:text-black">
//           Home
//         </span>
//       </button>
//       <div className="flex w-full flex-grow justify-around items-center">
//         <div className="bg-white text-black p-10 rounded-lg shadow-lg w-full max-w-[40rem]">
//           {pathname.includes('signup') ? <SignupInputForm /> : <SigninInputForm />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sign;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Sign = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/'); // 홈 경로로 이동
  }, [navigate]);

  return null; // 이동 후에는 아무 것도 렌더링하지 않음
};

export default Sign;