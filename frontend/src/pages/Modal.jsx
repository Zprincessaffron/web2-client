import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-lg max-w-sm mx-auto"
        initial={{ y: '-100vh' }}
        animate={{ y: 0 }}
        exit={{ y: '100vh' }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4">Coming Soon!</h2>
        <p className="mb-4">Our saffron buying site is launching soon. Stay tuned for updates!</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Modal;
