import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import './Scrollbar.css'; // Import the custom scrollbar CSS
import { useLocation } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";


const AmericanCuisine = () => {
  const [recipes, setRecipes] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const location = useLocation();
  const { user, userIdParams } = location.state || {};
  console.log({user});
  console.log(userIdParams)


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/american-cuisine');
        setRecipes(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const [displayedRecipes, setDisplayedRecipes] = useState(recipes);

  useEffect(() => {
    if (userIdParams) {
      setDisplayedRecipes(recipes?.slice(0, 3));
     
    } else {
      setDisplayedRecipes(recipes);
    }
  }, [userIdParams, recipes]);

  const toggleRecipeDetails = async (recipe) => {
    if (expandedRecipeId === recipe._id) {
      setExpandedRecipeId(null);
      setSelectedRecipe(null);
      return;
    }

    const userId = user?.uniqueId;
    try {
      await axios.post('/api/store-interaction', {
        userId: userId,
        recipeId: recipe._id,
        recipeName: recipe.name,
        useCase: 'culinary',
        cuisine: 'American Cuisine' // Update the cuisine type if needed
      });

      setExpandedRecipeId(recipe._id);
      setSelectedRecipe(recipe);
    } catch (err) {
      console.error('Failed to store interaction:', err);
    }
  };

  const closePopup = () => {
    setExpandedRecipeId(null);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-custom-gradient-6 p-8 rounded-lg shadow-lg md:w-full w-[90%] max-w-lg relative">
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
  

  const handleClick = (recipeId, index) => {
    if (!userIdParams || index <= 2) {
      toggleRecipeDetails(recipeId);
    } else {
      setModalMessage('To gain full access on our platform, you need to purchase a product. Once your order is delivered, you will receive a unique access ID along with a QR code in your shipment box. By scanning the QR code and entering your unique access ID on the site, you will unlock comprehensive access to our entire platform. Currently, you are in demo mode, which limits your access to certain features and content.');
      setIsModalOpen(true);
    }
  };

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
  if (!recipes) return (
    <motion.p
      className="text-gray-500 text-center mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Loading...
    </motion.p>
  );

  return (
    <div className="bg-custom-gradient-6 min-h-screen p-10">
      <h1 className="text-3xl md:text-5xl text-white font-medium text-center mb-8 uppercase tracking-widest">
        American Cuisine
      </h1>
      <hr className="mb-8" />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {recipes.map((recipe, index) => (
          <motion.div
            key={index}
            className={`shadow-xl rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500 border ${
              userIdParams && index > 2 ? "cursor-not-allowed opacity-10%" : ""
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            // onClick={() => toggleRecipeDetails(recipe)}
            onClick={() => handleClick(recipe, index)}
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
                {recipe.name}
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
            className="bg-custom-gradient-6 p-10 rounded-lg shadow-2xl max-w-3xl w-full max-h-screen relative overflow-y-auto scrollbar-custom"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <button
              className="absolute top-10 right-4 text-slate-100 hover:text-gray-200 transition-colors"
              onClick={() => setSelectedRecipe(null)}
            >
              <AiOutlineClose size={28} />
            </button>
            <h2 className="md:text-3xl text-md text-white tracking-widest font-medium mb-8 text-center uppercase">
              {selectedRecipe.name}
            </h2>
            <div className="max-h-[70vh] overflow-y-auto p-4 text-white scrollbar-custom">
              <h3 className="md:text-2xl text-lg tracking-widest font-medium mb-3">Ingredients :</h3>
              <ul className="list-disc text-sm pl-5 mb-4">
                {Array.isArray(selectedRecipe.ingredients) ? (
                  selectedRecipe.ingredients.map((item, i) => (
                    <motion.li
                      key={i}
                      className="mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      {item}
                    </motion.li>
                  ))
                ) : (
                  Object.entries(selectedRecipe.ingredients).map(([section, items]) => (
                    <motion.div key={section} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      <strong>{section.charAt(0).toUpperCase() + section.slice(1)}:</strong>
                      <ul className="list-disc text-sm pl-5">
                        {items.map((item, i) => (
                          <motion.li key={i} className="mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ))
                )}
              </ul>
              <h3 className="md:text-2xl text-lg tracking-widest font-medium mb-3">Instructions :</h3>
              <ol className="list-disc text-sm pl-5 mb-4">
                {selectedRecipe.instructions.map((step, i) => (
                  <motion.li key={i} className="mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                    {step}
                  </motion.li>
                ))}
              </ol>
              {selectedRecipe.tips?.length > 0 && (
                <>
                  <h3 className="md:text-2xl text-lg tracking-widest font-medium mb-3">Tips :</h3>
                  <ul className="list-disc text-sm pl-5 mb-4">
                    {selectedRecipe.tips.map((tip, i) => (
                      <motion.li key={i} className="mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}
              {selectedRecipe.variations?.length > 0 && (
                <>
                  <h3 className="md:text-2xl text-lg tracking-widest font-medium mb-3">Variations :</h3>
                  <ul className="list-disc text-sm pl-5 mb-4">
                    {selectedRecipe.variations.map((variation, i) => (
                      <motion.li key={i} className="mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                        {variation}
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}
              {/* <p className="mt-4 text-sm tracking-wider">
                <strong className='md:text-2xl text-lg'>Preparation Time :</strong> {selectedRecipe.preparationTime?.active} (Active) + {selectedRecipe.preparationTime?.cooking} (Cooking) = {selectedRecipe.preparationTime?.total} (Total)
              </p> */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AmericanCuisine;
