import React from 'react';
import { motion } from 'framer-motion';

const AiSuggestion = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <motion.section
        className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center h-1/3 text-white overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <h1 className="relative text-4xl font-extrabold text-center z-10">
          Saffron AI Recipe Bot
        </h1>
      </motion.section>

      {/* AI Bot Announcement Section */}
      <motion.section
        className="flex-grow bg-gray-100 flex items-center justify-center py-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold mb-4 text-yellow-600">
              Coming Soon: AI Saffron Recipe Bot!
            </h2>
            <p className="text-gray-700 mb-4">
              We're excited to announce that our AI-powered saffron recipe bot
              is on its way! Stay tuned for personalized recipe suggestions and
              saffron tips tailored to your preferences.
            </p>
            <p className="text-gray-500">
              In the meantime, feel free to explore our existing saffron use
              cases and recipes. We'll keep you updated with the latest news on
              our upcoming AI bot launch.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AiSuggestion;
