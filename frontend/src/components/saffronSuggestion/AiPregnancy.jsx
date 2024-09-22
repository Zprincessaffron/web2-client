import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner, FaMicrophone } from "react-icons/fa";
import Modal from "../../pages/Modal";
import aiPregnancyImg from "/aiPregnancyImg.jpg";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { IoIosCloseCircleOutline } from "react-icons/io";

const AiPregnancy = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [credits, setCredits] = useState();
  const location = useLocation();
  const { user, userIdParams } = location.state || {};
  console.log(userIdParams);

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
    setIsListening(!isListening);
  };

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

  // Fetch pregnancy details
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
      const response = await axios.post("/api/pregnancy", {
        input: searchQuery,
      });
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


      await axios.post("/api/store-interaction", {
        userId: user?.uniqueId ,
        itemName: searchQuery,
        useCase: "Pregnancy", 
        category: "Pregnant Women Usage", 
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
    const lines = details.split("\n");
    const overviewIndex = lines.findIndex((line) => line.includes("Overview"));
    const dietaryRecommendationsIndex = lines.findIndex((line) =>
      line.includes("Dietary Recommendations")
    );
    const saffronBenefitsIndex = lines.findIndex((line) =>
      line.includes("Saffron Benefits")
    );
    const saffronDosageIndex = lines.findIndex((line) =>
      line.includes("Saffron Dosage")
    );
    const remedyPreparationIndex = lines.findIndex((line) =>
      line.includes("Remedy Preparation")
    );
    const applicationFrequencyIndex = lines.findIndex((line) =>
      line.includes("Application and Frequency")
    );
    const additionalTipsIndex = lines.findIndex((line) =>
      line.includes("Additional Tips")
    );

    const overview = lines
      .slice(overviewIndex + 1, dietaryRecommendationsIndex)
      .filter((line) => line.trim() !== "");
    const dietaryRecommendations = lines
      .slice(dietaryRecommendationsIndex + 1, saffronBenefitsIndex)
      .filter((line) => line.trim() !== "");
    const saffronBenefits = lines
      .slice(saffronBenefitsIndex + 1, saffronDosageIndex)
      .filter((line) => line.trim() !== "");
    const saffronDosage = lines
      .slice(saffronDosageIndex + 1, remedyPreparationIndex)
      .filter((line) => line.trim() !== "");
    const remedyPreparation = lines
      .slice(remedyPreparationIndex + 1, applicationFrequencyIndex)
      .filter((line) => line.trim() !== "");
    const applicationFrequency = lines
      .slice(applicationFrequencyIndex + 1, additionalTipsIndex)
      .filter((line) => line.trim() !== "");
    const additionalTips = lines
      .slice(additionalTipsIndex + 1)
      .filter((line) => line.trim() !== "");

    return {
      overview,
      dietaryRecommendations,
      saffronBenefits,
      saffronDosage,
      remedyPreparation,
      applicationFrequency,
      additionalTips,
    };
  };

  const {
    overview = [],
    dietaryRecommendations = [],
    saffronBenefits = [],
    saffronDosage = [],
    remedyPreparation = [],
    applicationFrequency = [],
    additionalTips = [],
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
        <div className="absolute text-[13px] tracking-wider top-4 right-4 text-white font-medium border p-2">
          Credits Left: {credits}
        </div>
      )}
      <div
        className={`relative border rounded-lg md:w-full w-[90%] max-w-4xl ${
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
            className="md:text-5xl text-2xl tracking-[10px] font-medium mb-8 text-center text-white"
            variants={slideInFromRight}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            PREGNANCY
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
                  placeholder="How can I assist you with your pregnancy condition ?"
                  className="border font-medium text-sm bg-custom-gradient-7 text-white tracking-wider py-4 px-8 rounded-lg w-full shadow-md focus:outline-none focus:ring-2 focus:ring-white placeholder-slate-400"
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
                className=" hover:bg-white hover:text-purple-950 font-medium tracking-widest border text-white px-8 py-2 text-sm rounded-lg shadow-md transition"
                disabled={loading || !searchQuery}
                variants={slideInFromRight}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
              >
                Get Pregnancy Details
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {showDetails && (
          <Modal
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            title="Pregnancy Details"
          >
            <motion.div
              className="bg-custom-gradient-7 p-4 text-sm text-white"
              variants={slideInFromRight}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            >
              {overview.length > 0 && (
                <>
                  <h3 className="md:text-3xl text-md tracking-widest font-medium mb-4">
                    Overview :
                  </h3>
                  <ul className="list-disc mb-6 tracking-wider font-medium text-white">
                    {overview.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {dietaryRecommendations.length > 0 && (
                <>
                  <h3 className="md:text-3xl text-md tracking-widest font-medium mb-4 ">
                    Dietary Recommendations :
                  </h3>
                  <ul className="list-disc mb-6 tracking-wider font-medium text-white">
                    {dietaryRecommendations.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {saffronBenefits.length > 0 && (
                <>
                  <h3 className="md:text-3xl text-md tracking-widest font-medium mb-4 ">
                    Saffron Benefits :
                  </h3>
                  <ul className="list-disc mb-6 tracking-wider font-medium text-white">
                    {saffronBenefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </>
              )}

              {saffronDosage.length > 0 && (
                <>
                  <h3 className="md:text-3xl text-md tracking-widest font-medium mb-4 ">
                    Saffron Dosage :
                  </h3>
                  <ul className="list-disc tracking-wider font-medium text-white mb-6">
                    {saffronDosage.map((freq, index) => (
                      <li key={index}>{freq}</li>
                    ))}
                  </ul>
                </>
              )}

              {remedyPreparation.length > 0 && (
                <>
                  <h3 className="md:text-3xl text-md tracking-widest font-medium mb-4">
                    Remedy Preparation :
                  </h3>
                  <ul className="tracking-wider list-disc font-medium text-white mb-6">
                    {remedyPreparation.map((freq, index) => (
                      <li key={index}>{freq}</li>
                    ))}
                  </ul>
                </>
              )}

              {applicationFrequency.length > 0 && (
                <>
                  <h3 className="md:text-3xl text-md tracking-widest font-medium mb-4 ">
                    Application and Frequency :
                  </h3>
                  <ul className="list-disc tracking-wider font-medium text-white mb-6">
                    {applicationFrequency.map((freq, index) => (
                      <li key={index}>{freq}</li>
                    ))}
                  </ul>
                </>
              )}

              {additionalTips.length > 0 && (
                <>
                  <h3 className="md:text-3xl text-md tracking-widest font-medium mb-4 ">
                    Additional Tips :
                  </h3>
                  <ul className="list-disc tracking-wider font-medium text-white">
                    {additionalTips.map((freq, index) => (
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

export default AiPregnancy;
