import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const EuropeanCuisine = () => {
  const [recipes, setRecipes] = useState(null);
  const [error, setError] = useState(null);
  const [expandedRecipeIndex, setExpandedRecipeIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/european-cuisine');
        setRecipes(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const toggleRecipeDetails = (index) => {
    setExpandedRecipeIndex(expandedRecipeIndex === index ? null : index);
  };

  if (error) return <p className="text-red-500 text-center mt-4">Error: {error}</p>;
  if (!recipes) return <p className="text-gray-500 text-center mt-4">Loading...</p>;

  return (
    <div className="bg-blue-50 min-h-screen p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-600">European Cuisine Recipes</h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div
              className="cursor-pointer p-6"
              onClick={() => toggleRecipeDetails(index)}
            >
              <motion.h2
                className="text-2xl font-semibold mb-4 text-center text-blue-600 hover:text-blue-800 transition-colors"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {recipe.name}
              </motion.h2>
              {expandedRecipeIndex === index && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mt-4">Ingredients:</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {Array.isArray(recipe.ingredients) ? (
                      recipe.ingredients.map((item, i) => (
                        <motion.li key={i} className="mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                          {item}
                        </motion.li>
                      ))
                    ) : (
                      Object.entries(recipe.ingredients).map(([section, items]) => (
                        <motion.div key={section} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                          <strong>{section.charAt(0).toUpperCase() + section.slice(1)}:</strong>
                          <ul className="pl-5">
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
                  <h3 className="text-xl font-semibold mt-4">Instructions:</h3>
                  <ol className="list-decimal pl-5 mb-4">
                    {recipe.instructions.map((step, i) => (
                      <motion.li key={i} className="mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                        {step}
                      </motion.li>
                    ))}
                  </ol>
                  {recipe.tips?.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mt-4">Tips:</h3>
                      <ul className="list-disc pl-5 mb-4">
                        {recipe.tips.map((tip, i) => (
                          <motion.li key={i} className="mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                            {tip}
                          </motion.li>
                        ))}
                      </ul>
                    </>
                  )}
                  {recipe.variations?.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mt-4">Variations:</h3>
                      <ul className="list-disc pl-5 mb-4">
                        {recipe.variations.map((variation, i) => (
                          <motion.li key={i} className="mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                            {variation}
                          </motion.li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p className="mt-4">
                    <strong>Preparation Time:</strong> {recipe.preparationTime?.active} (Active) + {recipe.preparationTime?.cooking} (Cooking) = {recipe.preparationTime?.total} (Total)
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EuropeanCuisine;
