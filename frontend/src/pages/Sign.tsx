import { Footer } from '../components/Footer';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { SignupInputForm } from '../components/SignUp/InputForm';
import { SigninInputForm } from '../components/SignIn/InputForm';
import { useLocation, useNavigate } from 'react-router-dom';

export const Sign = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const goHome = () => navigate('/'); // Adjust this path according to your home route

    return (
        <div className="w-full min-w-[80rem] h-screen m-auto flex flex-col items-center bg-custom-sky">

            <button
                className="mt-8 mb-4 inline-flex items-center justify-center p-1.5 text-lg font-medium text-gray-900 rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 hover:from-teal-300 hover:to-lime-300 hover:text-white focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800 transition-all ease-in duration-75"
                onClick={goHome}>
                <span className="relative px-6 py-3 bg-white dark:bg-gray-900 rounded-md hover:bg-opacity-0">
                    Home
                </span>
            </button>
            <div className="flex min-w-[80rem] w-[100rem] flex-grow justify-around items-center">
                {pathname.includes('signup') ? <SignupInputForm/> : <SigninInputForm/>}
            </div>
            <div className="min-w-[80rem] w-[80rem] min-h-[16rem] h-[16rem]">
                <Footer/>
            </div>
        </div>
    );
};