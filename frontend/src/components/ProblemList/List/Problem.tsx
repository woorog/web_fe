import React, { useEffect, useState } from 'react';
import { SigninInputForm } from '../../../components/SignIn/InputForm';
import { SignupInputForm } from '../../../components/SignUp/InputForm';
import ReadyForm from './ReadyForm';
import { useProblemState } from './hooks';
import { motion, useAnimation } from 'framer-motion';
import TextComponent from './Textcomponents';
import Welcome from './Welcome';

type ProblemProps = {
  problemId: number;
};

const Problem = ({ problemId }: ProblemProps) => {
  const {
    roomUrl,
    setRoomUrl,
    currentIndex,
    fade,
    user,
    showSignup,
    isLoggedIn,
    setIsLoggedIn,
    handleCreateRoom,
    handleJoinRoom,
    handleLogoutClick,
    handleSignupClick,
  } = useProblemState(problemId);

  const [isAnimating, setIsAnimating] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const signinControls = useAnimation();
  const readyControls = useAnimation();

  useEffect(() => {
    if (user.isLoggedIn) {
      setIsLoggedIn(true);
      readyControls.start({ opacity: 1, y: 0 });
    }
  }, [user.isLoggedIn, setIsLoggedIn, readyControls]);

  const handleLoginSuccessWithAnimation = async () => {
    setIsAnimating(true);
    setWelcomeVisible(true);
    await signinControls.start({ opacity: 0, y: 50, transition: { duration: 1 } });
    await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
    setWelcomeVisible(false);
    setIsLoggedIn(true);
    readyControls.start({ opacity: 1, y: 0, transition: { duration: 1 } });
    setIsAnimating(false);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, type: 'spring' } },
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen bg-transparent text-white" style={{ marginTop: '-120px' }}>
      <TextComponent fade={fade} currentIndex={currentIndex} showSignup={showSignup} />
      {welcomeVisible && <Welcome />}
      {isLoggedIn && !isAnimating && !welcomeVisible && (
        <motion.div
          className="flex flex-col items-center w-full max-w-screen-md mt-1" // Adjusted space between elements
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring' }}
        >
          <ReadyForm
            roomUrl={roomUrl}
            setRoomUrl={setRoomUrl}
            handleJoinRoom={handleJoinRoom}
            handleCreateRoom={handleCreateRoom}
            handleLogoutClick={handleLogoutClick}
          />
        </motion.div>
      )}
      {!isLoggedIn && !isAnimating && !showSignup && (
        <motion.div
          className="flex items-center justify-center w-full max-w-screen-lg" // Adjusted space between elements
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          <motion.div
            className="flex flex-col items-center justify-center w-full sm:w-3/5 max-w-screen-md" // Adjusted space between elements
            initial="hidden"
            animate="visible"
            variants={formVariants}
          >
            <SigninInputForm onSignupClick={handleSignupClick} onLoginSuccess={handleLoginSuccessWithAnimation} />
          </motion.div>
        </motion.div>
      )}
      {showSignup && (
        <div className="flex items-center justify-center w-full max-w-screen-lg space-y-1">
          <motion.div
            className="flex flex-col items-center justify-center w-full sm:w-3/5 max-w-screen-md" // Adjusted space between elements
            initial="hidden"
            animate="visible"
            variants={formVariants}
          >
            <SignupInputForm />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Problem);
