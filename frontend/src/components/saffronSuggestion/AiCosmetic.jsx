import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner, FaMicrophone } from "react-icons/fa";
import Modal from "../../pages/Modal";
import aiCosmeticImg from "/aiCosmeticImg.jpg"; // Ensure this is the correct path
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useLocation } from "react-router-dom";

const AiCosmetic = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isListening, setIsListening] = useState(false); // Add state for listening
  const location = useLocation();
  const { user } = location.state || {};
  console.log(user);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser does not support speech recognition.</div>;
  }

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Start or stop speech recognition
  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsListening(!isListening); // Toggle listening state
  };

  // Fetch beauty details
  const handleGetDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/beauty", { input: searchQuery });
      setDetails(response.data.details);
      setShowDetails(true);
      // Store interaction data
      await axios.post("/api/store-interaction", {
        userId: user?.uniqueId ,
        itemName: searchQuery,
        useCase: "Cosmetic", 
        category: "Beauty and Skincare", 
      });
    } catch (error) {
      setError(`Error fetching details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse details
  const parseDetails = (details) => {
    const lines = details.split("\n").filter((line) => line.trim() !== "");
    console.log("Lines:", lines);
  
    const nameIndex = lines.findIndex((line) =>
      line.toLowerCase().includes("name of the remedy")
    );
    const ingredientsIndex = lines.findIndex((line) =>
      line.toLowerCase().includes("ingredients")
    );
    const preparationIndex = lines.findIndex((line) =>
      line.toLowerCase().includes("preparation steps")
    );
    const applicationIndex = lines.findIndex((line) =>
      line.toLowerCase().includes("application")
    );
    const frequencyIndex = lines.findIndex((line) =>
      line.toLowerCase().includes("frequency")
    );
  
    const name =
      nameIndex !== -1 && ingredientsIndex !== -1
        ? lines[nameIndex].replace(/^.*?:\s*/, "").trim()
        : "";
  
    console.log("Extracted Name:", name);
  
    const ingredients =
      ingredientsIndex !== -1 && preparationIndex !== -1
        ? lines.slice(ingredientsIndex + 1, preparationIndex)
        : [];
  
    const preparationSteps =
      preparationIndex !== -1 && applicationIndex !== -1
        ? lines.slice(preparationIndex + 1, applicationIndex)
        : [];
  
    const application =
      applicationIndex !== -1 && frequencyIndex !== -1
        ? lines.slice(applicationIndex + 1, frequencyIndex)
        : [];
  
    const frequency =
      frequencyIndex !== -1 ? lines.slice(frequencyIndex + 1) : [];
  
    return { name, ingredients, preparationSteps, application, frequency };
  };
  
  

  const {
    name = '',
    ingredients = [],
    preparationSteps = [],
    application = [],
    frequency = [],
  } = details ? parseDetails(details) : {};

  useEffect(() => {
    console.log("Details:", details); // Add this line to check the data structure
  }, [details]);
  

  // Use transcript when it changes
  useEffect(() => {
    if (listening) {
      setSearchQuery(transcript);
    }
  }, [transcript]);
  // Framer Motion Variants for Sliding In from the Right
  const slideInFromRight = {
    hidden: { opacity: 0, x: "100vw" },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div
      className="h-screen bg-custom-gradient-7 flex flex-col items-center justify-center overflow-x-hidden"
    >
      <div
        className={`relative  rounded-lg border md:w-full w-[90%] max-w-4xl ${
          loading ? "border-none shadow-none pointer-events-none" : "shadow-xl"
        }`}
      >
        {loading && (
          <div className="absolute inset-0 bg-custom-gradient-7 text-white bg-opacity-100 rounded-lg flex justify-center items-center z-50">
            <FaSpinner className="animate-spin text-5xl text-white" />
            <p className="text-white text-2xl tracking-[7px] font-medium ml-4">Loading...</p>
          </div>
        )}

        <motion.div
          className="backdrop-blur-md p-8 rounded-xl"
          variants={slideInFromRight}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.h1
            className="md:text-5xl text-2xl tracking-[6px] font-medium mb-8 text-center text-white"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            BEAUTY AND SKINCARE
          </motion.h1>

          <motion.div
            className="flex flex-col justify-evenly gap-6"
            variants={slideInFromRight}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <motion.div
                className="relative w-full md:w-3/4"
                variants={slideInFromRight}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Enter your skin concern"
                  className="border text-sm font-medium bg-custom-gradient-7 text-white tracking-wider py-4 px-8 rounded-lg w-full shadow-md focus:outline-none focus:ring-2 focus:ring-white placeholder-slate-400"
                  disabled={loading}
                />
                <FaMicrophone
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-green-500 cursor-pointer ${
                    isListening ? "animate-pulse text-red-500" : ""
                  }`}
                  onClick={toggleListening}
                />
              </motion.div>
              <motion.button
                onClick={handleGetDetails}
                className=" hover:bg-white hover:text-purple-950 font-medium tracking-widest border text-white text-sm px-8 py-2 rounded-lg shadow-md transition"
                disabled={loading || !searchQuery}
                variants={slideInFromRight}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
              >
                Get Beauty Details
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {showDetails && (
          <Modal
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            title="Beauty Details"
          >
            <motion.div
              className="bg-custom-gradient-7 p-4 text-white text-sm"
              variants={slideInFromRight}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            >
              {name && (
                <>
                  <h3 className="md:text-xl text-white text-[19px] tracking-wider font-medium mb-4">
                  {name}
                  </h3>
                  <p className=""></p>
                </>
              )}
              {ingredients.length > 0 && (
                <>
                  <h3 className="md:text-xl text-lg tracking-widest font-medium mb-4 ">
                    Ingredients :
                  </h3>
                  <ul className="list-disc tracking-wider font-medium list-inside mb-6 text-white">
                    {ingredients.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {preparationSteps.length > 0 && (
                <>
                  <h3 className="md:text-xl text-lg tracking-widest font-medium mb-4 ">
                    Preparation Steps :
                  </h3>
                  <ol className="mb-6 list-disc tracking-wider font-medium text-white">
                    {preparationSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </>
              )}

              {application.length > 0 && (
                <>
                  <h3 className="md:text-xl text-lg  tracking-widest font-medium mb-4 ">
                    Application :
                  </h3>
                  <ul className="list-disc mb-6 tracking-wider font-medium text-white">
                    {application.map((app, index) => (
                      <li key={index}>{app}</li>
                    ))}
                  </ul>
                </>
              )}

              {frequency.length > 0 && (
                <>
                  <h3 className="md:text-xl text-lg  tracking-widest font-medium mb-4 ">
                    Frequency :
                  </h3>
                  <ul className="list-disc tracking-wider font-medium text-white">
                    {frequency.map((freq, index) => (
                      <li key={index}>{freq}</li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AiCosmetic;
