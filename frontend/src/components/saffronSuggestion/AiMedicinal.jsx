import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSpinner, FaMicrophone } from "react-icons/fa";
import Modal from "../../pages/Modal";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./Scrollbar.css";
import { useLocation } from "react-router-dom";

const AiMedicinal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isListening, setIsListening] = useState(false); // State for listening

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

  const location = useLocation();
  const { user } = location.state || {};
  console.log(user);

  // Fetch medicinal details
  const handleGetDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/medicinal", {
        input: searchQuery,
      });
      setDetails(response.data.details);
      setShowDetails(true);
      // Store interaction data
      await axios.post("/api/store-interaction", {
        userId: user?.uniqueId,
        itemName: searchQuery,
        useCase: "Medicinal",
        category: "Medicinal Usage",
      });
      setSearchQuery("");
    } catch (error) {
      setError(`Error fetching details: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse details
  const parseDetails = (details) => {
    const lines = details.split("\n").map((line) => line.trim()); // Trim each line

    const findSectionIndex = (sectionName) =>
      lines.findIndex((line) => line.includes(sectionName));

    const nameOfRemedyIndex = findSectionIndex("Name of the Remedy");
    const mechanismIndex = findSectionIndex("Mechanism");
    const ingredientsIndex = findSectionIndex("Ingredients");
    const preparationIndex = findSectionIndex("Preparation Steps");
    const applicationIndex = findSectionIndex("Application");
    const frequencyIndex = findSectionIndex("Frequency");
    const saffronDosageIndex = findSectionIndex("Saffron Dosage");
    const additionalTipsIndex = findSectionIndex("Additional Tips");

    const getSectionContent = (startIndex, endIndex) => {
      return lines
        .slice(startIndex + 1, endIndex)
        .filter((line) => line.trim() !== "")
        .join("\n")
        .trim();
    };

    // Extract remedy name directly from the line
    const nameOfRemedy =
      nameOfRemedyIndex !== -1
        ? lines[nameOfRemedyIndex].split(":")[1].trim()
        : "";

    const mechanism =
      mechanismIndex !== -1
        ? getSectionContent(mechanismIndex, ingredientsIndex).split("\n")
        : [];
    const ingredients =
      ingredientsIndex !== -1
        ? getSectionContent(ingredientsIndex, preparationIndex).split("\n")
        : [];
    const preparationSteps =
      preparationIndex !== -1
        ? getSectionContent(preparationIndex, applicationIndex).split("\n")
        : [];
    const application =
      applicationIndex !== -1
        ? getSectionContent(applicationIndex, frequencyIndex).split("\n")
        : [];
    const frequency =
      frequencyIndex !== -1
        ? getSectionContent(frequencyIndex, saffronDosageIndex).split("\n")
        : [];
    const saffronDosage =
      saffronDosageIndex !== -1
        ? getSectionContent(saffronDosageIndex, additionalTipsIndex).split("\n")
        : [];
    const additionalTips =
      additionalTipsIndex !== -1
        ? getSectionContent(additionalTipsIndex, lines.length).split("\n")
        : [];

    return {
      nameOfRemedy,
      mechanism,
      ingredients,
      preparationSteps,
      application,
      frequency,
      saffronDosage,
      additionalTips,
    };
  };

  // Test the output in console
  // console.log("Name of Remedy:", nameOfRemedy); // Check this value

  const {
    nameOfRemedy = "",
    mechanism = [],
    ingredients = [],
    preparationSteps = [],
    application = [],
    frequency = [],
    saffronDosage = [],
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
    <div className="h-screen bg-custom-gradient-7 flex flex-col items-center justify-center overflow-x-hidden">
      <div
        className={`relative border rounded-lg md:w-full w-[90%] max-w-4xl ${
          loading ? "border-none shadow-none pointer-events-none" : "shadow-xl"
        }`}
      >
        {loading && (
          <div className="absolute inset-0 bg-custom-gradient-7 text-white bg-opacity-100 rounded-lg flex justify-center items-center z-50">
            <FaSpinner className="animate-spin text-5xl text-white" />
            <p className="text-white text-2xl tracking-[7px] font-medium ml-4">
              Loading...
            </p>
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
            MEDICINAL
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
                  placeholder="How can I assist you with your health condition ?"
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
                Get Medicinal Details
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {showDetails && (
          <Modal
            isOpen={showDetails}
            onClose={() => setShowDetails(false)}
            title="Medicinal Details"
          >
            <motion.div
              className="bg-custom-gradient-7 p-3 text-white text-sm"
              variants={slideInFromRight}
              initial="hidden"
              animate="visible"
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            >
              {nameOfRemedy.length > 0 && (
                <>
                  <h3 className="md:text-xl text-[17px] text-white tracking-wider font-medium mb-4">
                    {nameOfRemedy}
                  </h3>
                </>
              )}

              {mechanism.length > 0 && (
                <>
                  <h3 className="md:text-xl text-lg tracking-widest font-medium mb-4">
                    Mechanism :
                  </h3>
                  <ul className="list-disc tracking-wider font-medium mb-6 text-white">
                    {mechanism.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {ingredients.length > 0 && (
                <>
                  <h3 className="md:text-xl text-lg tracking-widest font-medium mb-4 ">
                    Ingredients :
                  </h3>
                  <ul className="list-disc tracking-wider font-medium mb-6 text-white">
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
                  <h3 className="md:text-xl text-lg tracking-widest font-medium mb-4 ">
                    Application :
                  </h3>
                  <ul className="list-disc tracking-wider font-medium mb-6 text-white">
                    {application.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              {frequency.length > 0 && (
                <>
                  <h3 className="md:text-xl text-lg tracking-widest font-medium mb-4 ">
                    Frequency :
                  </h3>
                  <p className="text-white tracking-wider font-medium mb-6">
                    {frequency.join(" ")}
                  </p>
                </>
              )}

              {saffronDosage.length > 0 && (
                <>
                  <h3 className="md:text-xl text-lg tracking-widest font-medium mb-4 ">
                    Saffron Dosage :
                  </h3>
                  <p className="text-white tracking-wider font-medium mb-6">
                    {saffronDosage.join(" ")}
                  </p>
                </>
              )}

              {additionalTips.length > 0 && (
                <>
                  <h3 className="md:text-xl text-lg tracking-widest font-medium mb-4 ">
                    Additional Tips :
                  </h3>
                  <ul className="list-disc tracking-wider font-medium mb-6 text-white">
                    {additionalTips.map((tip, index) => (
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

export default AiMedicinal;
