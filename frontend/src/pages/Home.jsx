import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from './Modal'; 

const Home = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col">
      {/* Use Cases Section */}
      <motion.section
        onClick={() => navigate('/use-cases')}
        className="relative bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center h-screen text-white cursor-pointer overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <h2 className="relative text-4xl font-extrabold text-center z-10">
          Saffron Use Cases
        </h2>
      </motion.section>

      {/* AI Suggested Recipe Section */}
      <motion.section
        onClick={() => navigate('/ai-suggestion')}
        className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center h-screen text-white cursor-pointer overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <h2 className="relative text-4xl font-extrabold text-center z-10">
          AI Saffron Suggestion
        </h2>
      </motion.section>

      {/* Navigate to New Site Section */}
      <motion.section
        onClick={() => setIsModalOpen(true)} // Open the modal when clicked
        className="relative bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center h-screen text-white cursor-pointer overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <h2 className="relative text-4xl font-extrabold text-center z-10">
          ZPrincessaffron
        </h2>
      </motion.section>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;
