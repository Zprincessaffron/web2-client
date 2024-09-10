import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import './Scrollbar.css'; // Import the custom scrollbar CSS

const RecipeDisplay = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null); // State for tracking expanded item
  const [clickedPosition, setClickedPosition] = useState({ top: 0, left: 0 });
  const itemRefs = useRef([]);

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

  const openRecipeDetails = (recipe, index) => {
    const rect = itemRefs.current[index].getBoundingClientRect();
    setClickedPosition({ top: rect.top, left: rect.left });

    if (expandedItemId === recipe._id) {
      setExpandedItemId(null);
      setSelectedRecipe(null);
      return;
    }

    setExpandedItemId(recipe._id);
    setSelectedRecipe(recipe);
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
    setExpandedItemId(null);
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
            className="shadow-xl rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500 border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onClick={() => openRecipeDetails(category, index)}
            ref={el => itemRefs.current[index] = el}
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
