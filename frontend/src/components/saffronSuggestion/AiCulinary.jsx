import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner, FaMicrophone } from "react-icons/fa";
import Modal from "../../pages/Modal";
import aiCulinaryImg from "/aiCulinaryImg.jpg";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useLocation } from "react-router-dom";

const AiCulinary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isListening, setIsListening] = useState(false); // Add state for listening
  const location = useLocation();
  const { user } = location.state || {}
  console.log(user)
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

  // Fetch dish recommendations
  const handleRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/culinary");
      setRecommendations(response.data.recommendations);
      setDetails(null);
      setShowRecommendations(true);
      await axios.post("/api/store-interaction", {
        userId: user?.uniqueId ,
        recipeName: searchQuery,
        useCase: "Culinary", 
        category: "Culinary Recommendation", 
      });
    } catch (error) {
      setError(`Error fetching recommendations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch dish details
  const handleDetails = async (dish) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/culinary/details", { dish });
      setDetails(response.data.details);
      setShowDetails(true);
      await axios.post("/api/store-interaction", {
        userId: user?.uniqueId ,
        recipeName: searchQuery,
        useCase: "Culinary", 
        category: "Culinary Dish Details", 
      });
    } catch (error) {
      setError(`Error fetching dish details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Parse details into ingredients, preparation steps, and tips
  const parseDetails = (details) => {
    const lines = details.split("\n");

    // Find indices for different sections
    const ingredientsIndex = lines.findIndex((line) => line.includes("Ingredients"));
    const preparationIndex = lines.findIndex((line) => line.includes("Preparation Steps"));
    const tipsIndex = lines.findIndex((line) => line.includes("Tips"));

    // Default empty arrays
    const ingredients = [];
    const preparationSteps = [];
    const tips = [];

    // Extract ingredients
    if (ingredientsIndex !== -1) {
      const nextSectionIndex = preparationIndex !== -1 ? preparationIndex : lines.length;
      for (let i = ingredientsIndex + 1; i < nextSectionIndex; i++) {
        const line = lines[i].trim();
        if (line) {
          ingredients.push(line);
        }
      }
    }

    // Extract preparation steps
    if (preparationIndex !== -1) {
      const nextSectionIndex = tipsIndex !== -1 ? tipsIndex : lines.length;
      for (let i = preparationIndex + 1; i < nextSectionIndex; i++) {
        const line = lines[i].trim();
        if (line) {
          preparationSteps.push(line);
        }
      }
    }

    // Extract tips
    if (tipsIndex !== -1) {
      for (let i = tipsIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          tips.push(line);
        }
      }
    }

    return { ingredients, preparationSteps, tips };
  };

  const {
    ingredients = [],
    preparationSteps = [],
    tips = [],
  } = details ? parseDetails(details) : {};

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
      className="h-screen bg-custom-gradient-7 flex flex-col items-center justify-center"
    >
      <div
        className={`relative border rounded-lg shadow-xl w-full max-w-4xl ${
          loading ? "border-none shadow-none pointer-events-none" : ""
        }`}
      >
        {loading && (
          <div className="absolute inset-0 bg-custom-gradient-7 text-white bg-opacity-100 rounded-lg flex justify-center items-center z-50">
            <FaSpinner className="animate-spin text-5xl text-white" />
            <p className="text-white text-2xl tracking-[7px] font-bold ml-4">Loading...</p>
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
            className="md:text-5xl text-2xl tracking-[10px] font-extrabold mb-8 text-center text-white"
            variants={slideInFromRight}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            CULINARY
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
                  placeholder="Search for a dish..."
                  className="border font-semibold bg-custom-gradient-7 text-white tracking-wider py-4 px-8 rounded-lg w-full shadow-md focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
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
                onClick={handleRecommendations}
                className=" hover:bg-white hover:text-purple-950 font-semibold tracking-widest border text-white px-8 py-2 rounded-lg shadow-md transition"
                disabled={loading || !searchQuery}
                variants={slideInFromRight}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
              >
                Get Recommendations
              </motion.button>
              <motion.button
                onClick={() => handleDetails(searchQuery)}
                className=" hover:bg-white hover:text-purple-950 font-semibold tracking-widest border text-white px-8 py-2 rounded-lg shadow-md transition"
                disabled={loading || !searchQuery}
                variants={slideInFromRight}
                initial="hidden"
                animate="visible"
                transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
              >
                Get Dish Details
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {showRecommendations && (
          <Modal
            isOpen={showRecommendations}
            onClose={() => setShowRecommendations(false)}
            title="Dish Recommendations"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((dish, index) => (
                  <motion.div
                    key={index}
                    onClick={() => handleDetails(dish)}
                    className="border text-white hover:text-violet-950 p-6 rounded-lg shadow-lg cursor-pointer hover:bg-gray-100 transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <p className="text-md font-medium tracking-wider">{dish}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Modal>
        )}

        {showDetails && (
          <Modal
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            title="Dish Details"
          >
            <motion.div
              className="bg-custom-gradient-7 p-8 text-white"
              variants={slideInFromRight}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            >
              {ingredients.length > 0 && (
                <>
                  <h3 className="text-3xl tracking-widest font-semibold mb-4 ">
                    Ingredients :
                  </h3>
                  <ul className="list-disc list-inside mb-6 tracking-wider text-white font-medium">
                    {ingredients.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {preparationSteps.length > 0 && (
                <>
                  <h3 className="text-3xl tracking-widest font-semibold mb-4 ">
                    Preparation Steps :
                  </h3>
                  <ol className="mb-6 tracking-wider text-white font-medium">
                    {preparationSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </>
              )}

              {tips.length > 0 && (
                <>
                  <h3 className="text-3xl tracking-widest font-semibold mb-4 ">
                    Tips :
                  </h3>
                  <ul className="list-disc list-inside mb-6 tracking-wider text-white font-medium">
                    {tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
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

export default AiCulinary;
