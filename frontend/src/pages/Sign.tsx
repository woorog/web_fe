import { SignupInputForm } from '../components/SignUp/InputForm';
import { SigninInputForm } from '../components/SignIn/InputForm';
import { LogoHeader } from '../components/LogoHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import space from '../assets/space.mp4';

export const Sign = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="relative w-full h-screen flex flex-col items-center text-white">
      <video autoPlay loop muted className="absolute w-full h-full object-cover">
        <source src={space} type="video/mp4" />
      </video>
      <div className="relative z-10 w-full">
        <LogoHeader />
      </div>
      <div className="relative z-10 w-full flex-grow flex flex-col justify-center items-center">
        <div className="bg-white bg-opacity-80 text-black p-10 rounded-lg shadow-lg w-full max-w-[40rem]">
          {pathname.includes('signup') ? <SignupInputForm /> : <SigninInputForm />}
        </div>
      </div>
    </div>
  );
};

export default Sign;
