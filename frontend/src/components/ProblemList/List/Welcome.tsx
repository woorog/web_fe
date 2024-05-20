import React from 'react';
import { motion } from 'framer-motion';
import GO from '../../../assets/GO.gif';

const Welcome = () => {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        style={{ fontSize: '4em' }}
        className="font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Welcome To ONCORE!
      </motion.div>
    </div>
  );
};

export default Welcome;