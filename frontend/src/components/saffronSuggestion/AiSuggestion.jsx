import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const AiSuggestion = () => {
  const [showOptions, setShowOptions] = useState(false);
  const location = useLocation();
    const { user } = location.state || {};

  // Define the speak function outside of the useEffect hooks
  const speak = (text, onEndCallback) => {
    const message = new SpeechSynthesisUtterance(text);
    message.voice = speechSynthesis.getVoices().find(voice => voice.lang === 'en-US');
    message.pitch = 1;
    message.rate = 1;

    if (onEndCallback) {
      message.onend = onEndCallback;
    }

    speechSynthesis.speak(message);
  };

  useEffect(() => {
    // Initial speech message
    speak(
      "Hello! Welcome to the Saffron AI Suggestion page. This section helps you explore various uses of saffron. How can I assist you today?",
      () => {
        // Show options after the initial message is spoken
        setShowOptions(true);
      }
    );

    // Cleanup function to stop speech synthesis when the component unmounts
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (showOptions) {
      // Additional speech when options are shown
      speak("Click the option below to know more about your use cases.");
    }
  }, [showOptions]);

  return (
    <div className="flex flex-col h-screen bg-custom-gradient-7">
      {/* Chatbot Section */}
      <motion.section
        className="relative flex items-center justify-center h-screen text-white overflow-hidden top-0 z-30"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'inset 0 0 10rem rgba(0, 0, 0, 0.5)',
        }}
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative z-10 text-center px-6 md:px-12">
          <motion.h2
            className="text-3xl md:text-6xl uppercase font-medium tracking-[15px] leading-tight mb-5"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Saffron AI Suggestion
          </motion.h2>
          <motion.p
            className="font-medium tracking-widest md:text-md text-sm mb-8 max-w-lg mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Hello! Welcome to the Saffron AI Suggestion page. This section helps you explore various uses of saffron. How can I assist you today?
          </motion.p>
        
          {/* Display options only after the question is asked */}
          {showOptions && (
            <div className="mt-6 space-y-4">
              {["Culinary", "Cosmetic", "Medicinal", "Pregnancy"].map((option, index) => (
                <motion.div
                  key={option}
                  className="border bg-custom-gradient-7 rounded-full p-4 text-center shadow-md cursor-pointer"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to={`/ai-${option.toLowerCase()}`} state={{user}}>
                    <p className="text-md tracking-widest font-medium">{option}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default AiSuggestion;
