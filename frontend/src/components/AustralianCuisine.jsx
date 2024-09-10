import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import './Scrollbar.css'; // Import the custom scrollbar CSS
import { useLocation } from 'react-router-dom';

const AustralianCuisine = () => {
  const [recipes, setRecipes] = useState(null);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  const location = useLocation();
  const { user } = location.state || {}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/australian-cuisine');
        setRecipes(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const toggleRecipeDetails = async (recipe) => {
    if (expandedRecipeId === recipe._id) {
      setExpandedRecipeId(null);
      setSelectedRecipe(null);
      return;
    }

    try {
      await axios.post('/api/store-interaction', {
        userId: user.uniqueId,
        recipeId: recipe._id,
        recipeName: recipe.name,
        useCase: 'culinary',
        cuisine: 'Australian Cuisine' // Update the cuisine type if needed
      });

      setExpandedRecipeId(recipe._id);
      setSelectedRecipe(recipe);
    } catch (err) {
      console.error('Failed to store interaction:', err);
    }
  };

  const closeRecipeDetails = () => {
    setSelectedRecipe(null);
    setExpandedRecipeId(null);
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
    <div className="bg-custom-gradient-12 min-h-screen p-10">
      <h1 className="text-2xl md:text-5xl text-white font-medium text-center mb-8 uppercase tracking-widest">
        Australian Cuisine
      </h1>
      <hr className="mb-8" />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {recipes.map((recipe, index) => (
          <motion.div
            key={index}
            className="shadow-xl rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500 border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onClick={() => toggleRecipeDetails(recipe)}
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
            className="bg-custom-gradient-12 p-10 rounded-lg shadow-2xl max-w-3xl w-full max-h-screen relative overflow-y-auto scrollbar-custom"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <button
              className="absolute top-10 right-4 text-slate-100 hover:text-gray-200 transition-colors"
              onClick={closeRecipeDetails}
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

export default AustralianCuisine;
