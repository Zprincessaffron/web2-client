import React from 'react';
import { motion } from 'framer-motion';

const PregnantWomen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-pink-50">
      <motion.h1
        className="text-3xl font-semibold text-pink-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        We will update this use later
        <motion.p
          className='text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
        >
          Stay tuned...
        </motion.p>
      </motion.h1>
    </div>
  );
}

export default PregnantWomen;
