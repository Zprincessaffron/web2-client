import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <motion.div
        className="bg-custom-gradient-7 border rounded-lg shadow-lg md:w-full w-[90%] max-h-screen md:h-[90%] h-[90%] overflow-auto scrollbar-custom max-w-4xl p-8"
        initial={{ opacity: 0, y: '100vh' }}  // Start off-screen at the bottom
        animate={{ opacity: 1, y: 0 }}        // Slide up to its position
        exit={{ opacity: 0, y: '100vh' }}     // Slide back down when exiting
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="md:text-3xl text-[16px] tracking-widest uppercase font-medium text-custom text-white">{title} :</h2>
          <button
            className="text-white md:text-3xl text-xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default Modal;
