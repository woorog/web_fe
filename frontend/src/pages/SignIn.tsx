import { MainHeader } from '../components/MainHeader';
import { Footer } from '../components/Footer';
import React, { useEffect } from 'react';
import { SigninInputForm } from '../components/SignIn/InputForm';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoils';
import { useNavigate } from 'react-router-dom';
import { useUserState } from '../hooks/useUserState';

export const SignIn = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  useUserState();
  
  useEffect(() => {
    if (!user.isLoggedIn) {
      return;
    }
    navigate(-1);
  }, [user, navigate]);

  return (
    <div className="w-full h-auto mx-auto flex flex-col">
      <div className="w-full h-32 box-border">
        <MainHeader />
      </div>
      <div className="w-full flex-1 box-border sublime-dark-grey-blue flex justify-center">
        <SigninInputForm />
      </div>
      <div className="w-full h-[400px] box-border">
        <Footer />
      </div>
    </div>
  );
};

export default SignIn;
