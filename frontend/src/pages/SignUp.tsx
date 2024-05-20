import { MainHeader } from '../components/MainHeader';
import { SignupInputForm } from '../components/SignUp/InputForm';

export const SignUp = () => {
  return (
    <div className="w-full min-w-[80rem] h-screen mx-auto flex flex-col items-center bg-[#eef9f1]">
      <div className="min-w-[80rem] w-[80rem] min-h-[8rem] h-[8rem]">
        <MainHeader />
      </div>
      <div className="flex min-w-[80rem] w-[80rem] flex-grow justify-around">
        <SignupInputForm />
      </div>
    </div>
  );
};
