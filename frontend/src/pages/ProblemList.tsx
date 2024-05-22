import { MainHeader } from '../components/MainHeader';
import Problem from '../components/ProblemList/List/Problem';
import AlgorithmClassificationLoop from '../components/ProblemList/List/AlgorithmClassificationLoop';
import { useUserState } from '../hooks/useUserState';
import space from '../assets/space.mp4';

const Main = () => {
  const { user } = useUserState();

  return (
    <div className="relative w-full h-screen flex flex-col items-center text-white">
      <video autoPlay loop muted className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src={space} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="relative z-10 w-full">
        <MainHeader />
      </div>

      {user.isLoggedIn ? (
        <div className="relative flex flex-col items-center justify-center w-full h-full z-10 p-5 space-y-5">
          <AlgorithmClassificationLoop />
          <div className="bg-gray-100 p-5 w-full max-w-4xl rounded-xl">
            <Problem problemId={0} />
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center w-full h-full z-10 p-5 space-y-5">
          <AlgorithmClassificationLoop />
        </div>
      )}
    </div>
  );
};

export default Main;
