import { Footer } from '../components/Footer';
import React from 'react';
import { SignupInputForm } from '../components/SignUp/InputForm';
import { SigninInputForm } from '../components/SignIn/InputForm';
import { useLocation, useNavigate } from 'react-router-dom';

export const Sign = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goHome = () => navigate('/'); // Adjust this path according to your home route

  return (
    <div className="w-full min-w-[80rem] h-screen m-auto flex flex-col items-center bg-[#333333] text-white">
      <button
        className="mt-8 mb-4 inline-flex items-center justify-center p-1.5 text-lg font-bold text-white bg-[#333333] rounded-lg border-2 border-white transition-all ease-in duration-300 hover:bg-white hover:text-black"
        onClick={goHome}
      >
        <span className="relative px-6 py-3 rounded-md text-white hover:text-black">
          Home
        </span>
      </button>
      <div className="flex min-w-[80rem] w-[100rem] flex-grow justify-around items-center">
        <div className="bg-white text-black p-10 rounded-lg shadow-lg w-[50%]">
          {pathname.includes('signup') ? <SignupInputForm /> : <SigninInputForm />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Sign;