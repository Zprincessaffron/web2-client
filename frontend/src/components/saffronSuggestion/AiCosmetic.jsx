import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner, FaMicrophone } from "react-icons/fa";
import Modal from "../../pages/Modal";
import aiCosmeticImg from "/aiCosmeticImg.jpg"; // Ensure this is the correct path
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useLocation } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";

const AiCosmetic = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isListening, setIsListening] = useState(false); // Add state for listening
  const [credits, setCredits] = useState();
  const location = useLocation();
  const { user, userIdParams } = location.state || {};
  console.log(userIdParams);

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser does not support speech recognition.</div>;
  }

  useEffect(() => {
    // Fetch user credits from the backend
    const fetchCredits = async () => {
      try {
        const response = await axios.get(`/api/user-credits/${userIdParams}`);
        setCredits(response.data.credits || 0); // Default to 0 if no credits found
      } catch (error) {
        setError(`Error fetching credits: ${error.message}`);
      }
    };

    if (userIdParams) {
      fetchCredits();
    }
  }, [userIdParams]);

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

  const handleGetDetails = async () => {
    // Check if user has credits left
    if (credits <= 0) {
      // setShowCreditLimitPopup(true); // Show popup if no credits left
      setModalMessage(
        "To gain full access on our platform, you need to purchase a product. Once your order is delivered, you will receive a unique access ID along with a QR code in your shipment box. By scanning the QR code and entering your unique access ID on the site, you will unlock comprehensive access to our entire platform. Currently, you are in demo mode, which limits your access to certain features and content."
      );
      setIsModalOpen(true); // Open the modal when credits are 0
      return; // Stop further execution if credits are 0
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/beauty", { input: searchQuery });
      setDetails(response.data.details);
      setShowDetails(true);

      // Deduct 1 credit after a successful request
      const newCredits = credits - 1;
      setCredits(newCredits);

      // Update credits on the backend
      await axios.post("/api/update-credits", {
        userId: userIdParams,
        credits: newCredits
      });

      // Store interaction data
      await axios.post("/api/store-interaction", {
        userId: user?.uniqueId,
        itemName: searchQuery,
        useCase: "Cosmetic",
        category: "Beauty and Skincare",
      });
      setSearchQuery("");
    } catch (error) {
      setError(`Error fetching details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const AIModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-custom-gradient-7 p-8 rounded-lg shadow-lg md:w-full w-[90%] max-w-lg relative">
      <button
          onClick={onClose}
          className="absolute top-1 right-1 p-2 rounded-full text-white hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <IoIosCloseCircleOutline size={18}/>
          {/* <XIcon className="w-6 h-6 text-gray-600" /> */}
        </button>
        <p className="md:text-[15px] text-[13px] tracking-wider text-white">{message}</p>
      </div>
    </div>
    );
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
      {/* Show credits for users */}
      {userIdParams && (
        <div className="absolute top-4 right-4 text-white font-medium">
          Credits Left: {credits}
        </div>
      )}
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
          className="p-8 rounded-xl"
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
                className=" hover:bg-white hover:text-purple-950 text-sm font-medium tracking-widest border text-white px-8 py-2 rounded-lg shadow-md transition"
                disabled={loading || !searchQuery}
                variants={slideInFromRight}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
              >
                Get Beauty Details
              </motion.button>

              {/* <motion.button
                onClick={handleGetDetails}
                className={`font-medium tracking-widest border text-sm px-8 py-2 rounded-lg shadow-md transition
                  ${credits === 0 || loading || !searchQuery ? 
                    'bg-gray-200 text-gray-500 cursor-not-allowed' : 
                    'bg-white text-purple-950 hover:bg-white hover:text-purple-950'}`}
                disabled={credits === 0 || loading || !searchQuery}
                variants={slideInFromRight}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
              >
                {loading ? "Loading..." : "Get Beauty Details"}
              </motion.button> */}
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
        <AIModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
        />
      </div>
    </div>
  );
};

export default AiCosmetic;
