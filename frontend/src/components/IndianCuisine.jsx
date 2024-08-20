import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const IndianCuisine = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/indian-cuisine');
        setRecipes(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const toggleRecipeDetails = (id) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  if (error) return <p className="text-red-500 text-center mt-4">Error: {error}</p>;
  if (recipes.length === 0) return <p className="text-gray-500 text-center mt-4">Loading...</p>;

  const renderIngredients = (ingredients) => {
    if (!ingredients) return <p>No ingredients data available</p>;

    return Array.isArray(ingredients) ? (
      ingredients.map((item, i) => (
        <li key={i} className="mb-2">{item}</li>
      ))
    ) : (
      Object.entries(ingredients).map(([key, value], i) => (
        <div key={i} className="mb-2">
          <h4 className="font-semibold">{key}</h4>
          <ul className="list-disc pl-5">
            {Array.isArray(value) ? (
              value.map((item, j) => <li key={j}>{item}</li>)
            ) : (
              <li>{value}</li>
            )}
          </ul>
        </div>
      ))
    );
  };

  const renderInstructions = (instructions) => {
    if (!instructions) return <p>No instructions data available</p>;
  
    return Array.isArray(instructions) ? (
      <ol className="list-decimal pl-5 mb-4">
        {instructions.map((instruction, i) => {
          if (typeof instruction === 'string') {
            return <li key={i} className="mb-2">{instruction}</li>;
          } else if (typeof instruction === 'object' && instruction !== null) {
            return (
              <div key={i} className="mb-2">
                <h5 className="font-semibold">{instruction.step || `Step ${i + 1}`}</h5>
                <ul className="list-disc pl-5">
                  {Array.isArray(instruction.details) ? (
                    instruction.details.map((detail, j) => <li key={j}>{detail}</li>)
                  ) : (
                    <li>{instruction.details || 'No details available'}</li>
                  )}
                </ul>
              </div>
            );
          } else {
            return <li key={i}>Invalid instruction format</li>;
          }
        })}
      </ol>
    ) : (
      <p>Instructions should be an array</p>
    );
  };

  return (
    <div className="bg-orange-50 min-h-screen p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-red-600">Indian Cuisine Recipes</h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <motion.div
            key={recipe._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div
              className="cursor-pointer p-6"
              onClick={() => toggleRecipeDetails(recipe._id)}
            >
              <motion.h2
                className="text-2xl font-semibold mb-4 text-center text-red-600 hover:text-red-800 transition-colors"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {recipe.name}
              </motion.h2>
              {expandedRecipeId === recipe._id && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mt-4">Ingredients:</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {renderIngredients(recipe.ingredients)}
                  </ul>

                  <h3 className="text-xl font-semibold mt-4">Instructions:</h3>
                  {renderInstructions(recipe.instructions)}

                  {recipe.tips && recipe.tips.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mt-4">Tips:</h3>
                      <ul className="list-disc pl-5 mb-4">
                        {recipe.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {recipe.variations && recipe.variations.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mt-4">Variations:</h3>
                      <ul className="list-disc pl-5 mb-4">
                        {recipe.variations.map((variation, i) => (
                          <li key={i}>{variation}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IndianCuisine;
