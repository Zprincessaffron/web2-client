import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import './Scrollbar.css'; // Import the custom scrollbar CSS
import { useLocation } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";

const RecipeDisplay = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null); // State for tracking expanded item
  const [clickedPosition, setClickedPosition] = useState({ top: 0, left: 0 });
  const itemRefs = useRef([]);
  const location = useLocation();
  const {user, userIdParams} = location.state || {}
  console.log(user);
  console.log(userIdParams)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/pregnantwomen'); // Your API endpoint
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [displayedUsages, setDisplayedUsages] = useState(data);

  useEffect(() => {
    if (userIdParams) {
      setDisplayedUsages(data?.slice(0, 3));
     
    } else {
      setDisplayedUsages(data);
    }
  }, [userIdParams, data]);

  const openRecipeDetails = async(recipe, index) => {
    // const rect = itemRefs.current[index].getBoundingClientRect();
    // setClickedPosition({ top: rect.top, left: rect.left });

    if (expandedItemId === recipe._id) {
      setExpandedItemId(null);
      setSelectedRecipe(null);
      return;
    }

    const userId = user?.uniqueId; 
    try {
      await axios.post('/api/store-interaction', {
        userId: userId,
        itemId: recipe._id,
        itemName: recipe.condition,
        useCase: 'Medicinal',
        category: 'Medicinal Usage' 
      });

      setExpandedItemId(recipe._id);
      setSelectedRecipe(recipe);
    } catch (err) {
      console.error('Failed to store interaction:', err);
    }
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
    setExpandedItemId(null);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-custom-gradient-14 p-8 rounded-lg shadow-lg md:w-full w-[90%] max-w-lg relative">
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

  const handleClick = (category, index) => {
    if (!userIdParams || index <= 2) {
      openRecipeDetails(category);
    } else {
      setModalMessage('To gain full access on our platform, you need to purchase a product. Once your order is delivered, you will receive a unique access ID along with a QR code in your shipment box. By scanning the QR code and entering your unique access ID on the site, you will unlock comprehensive access to our entire platform. Currently, you are in demo mode, which limits your access to certain features and content.');
      setIsModalOpen(true);
    }
  };



  if (loading) return (
    <motion.p
      className="text-gray-500 text-center mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Loading...
    </motion.p>
  );

  if (error) return (
    <motion.p
      className="text-red-500 text-center mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Error: {error}
    </motion.p>
  );

  if (!data.length) return (
    <motion.p
      className="text-gray-500 text-center mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      No data available
    </motion.p>
  );

  return (
    <div className="bg-custom-gradient-14 min-h-screen p-10">
      <h1 className="text-2xl md:text-5xl text-white font-medium text-center mb-8 uppercase tracking-widest">
        Pregnant Women Usage
      </h1>
      <hr className="mb-8" />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.map((category, index) => (
          <motion.div
            key={category._id}
            className={`shadow-xl rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500 border ${
              userIdParams && index > 2 ? "cursor-not-allowed opacity-10%" : ""
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            // onClick={() => openRecipeDetails(category, index)}
            // ref={el => itemRefs.current[index] = el}
            onClick={() => handleClick(category, index)}
            style={{
              pointerEvents: userIdParams && index > 2 ? "auto" : "auto",
            }}
          >
            <div className="p-4 text-white">
              <motion.h2
                className="text-sm tracking-wider font-medium text-center transition-colors"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {category.title}
              </motion.h2>
            </div>
          </motion.div>
        ))}
        <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
        />
      </div>

      {selectedRecipe && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-custom-gradient-14 p-10 rounded-lg shadow-2xl max-w-3xl w-full max-h-screen relative overflow-y-auto scrollbar-custom"
            initial={{ opacity: 0, scale: 0.9, x: clickedPosition.left, y: clickedPosition.top }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: clickedPosition.left, y: clickedPosition.top }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <button
              className="absolute top-10 right-4 text-slate-100 hover:text-gray-200 transition-colors"
              onClick={closeRecipeDetails}
            >
              <AiOutlineClose size={28} />
            </button>
            <h2 className="md:text-3xl text-md text-white tracking-widest font-medium mb-4 text-center uppercase">
              {selectedRecipe.title}
            </h2>
            <div className="max-h-[70vh] overflow-y-auto p-4 text-white scrollbar-custom">
              {selectedRecipe.recipes.map((recipe, recipeIndex) => (
                <motion.div
                  key={recipeIndex}
                  className="mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: recipeIndex * 0.1 }}
                >
                  <h3 className="md:text-2xl text-lg font-medium tracking-wider pb-2">
                    {recipe.name} :
                  </h3>
                  <div className="tracking-wider mb-4">
                    <strong className="md:text-2xl text-lg tracking-widest font-medium my-3">Ingredients:</strong>
                    <ul className="list-disc text-sm pl-5">
                      {recipe.ingredients.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="tracking-wide mb-4">
                    <strong className="md:text-2xl text-lg tracking-widest font-medium my-3">Preparation:</strong>
                    <ol className="list-disc text-sm pl-5">
                      {recipe.preparation.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <p className="tracking-widest mb-4 text-sm">
                    <strong className="font-medium md:text-2xl text-lg">Consumption:</strong> {recipe.consumption}
                  </p>
                  <p className="tracking-widest mb-4 text-sm">
                    <strong className="font-medium md:text-2xl text-lg">Frequency:</strong> {recipe.frequency}
                  </p>
                  <p className="tracking-widest text-sm">
                    <strong className="font-medium md:text-2xl text-lg">Caution:</strong> <br /> While saffron is generally considered safe in moderate amounts, excessive consumption may not be advisable during pregnancy. It is crucial to follow recommended guidelines and consult your healthcare provider to ensure saffron is appropriate for your individual needs.
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default RecipeDisplay;
