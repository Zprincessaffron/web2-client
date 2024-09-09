import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import "./Scrollbar.css"; // Import the custom scrollbar CSS
import { useLocation } from "react-router-dom";

const IndianCuisine = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const location = useLocation();
  const { user } = location.state || {};
  console.log({user});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/indian-cuisine");
        setRecipes(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  // const toggleRecipeDetails = (id) => {
  //   setExpandedRecipeId(expandedRecipeId === id ? null : id);
  // };
  const toggleRecipeDetails = async (id) => {
    if (expandedRecipeId === id) {
      setExpandedRecipeId(null);
      return;
    }
  
    const selectedRecipe = recipes.find((recipe) => recipe._id === id);
  
    try {
      const userId = user.uniqueId; // Replace with the actual user ID
      await axios.post('/api/store-interaction', {
        userId: userId,
        recipeId: selectedRecipe._id,
        recipeName: selectedRecipe.name,
        useCase: 'culinary',
        cuisine: "Indian Cuisine"
      });
  
      setExpandedRecipeId(id);
    } catch (err) {
      console.error('Failed to store interaction:', err);
    }
  };
  

  const closePopup = () => {
    setExpandedRecipeId(null);
  };

  const renderIngredients = (ingredients) => {
    if (!ingredients) return <p>No ingredients data available</p>;

    return Array.isArray(ingredients)
      ? ingredients.map((item, i) => (
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
      : Object.entries(ingredients).map(([key, value], i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="font-semibold">{key}</h4>
            <ul className="list-disc pl-5">
              {Array.isArray(value) ? (
                value.map((item, j) => (
                  <motion.li
                    key={j}
                    className="mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: j * 0.1 }}
                  >
                    {item}
                  </motion.li>
                ))
              ) : (
                <motion.li
                  key={i}
                  className="mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  {value}
                </motion.li>
              )}
            </ul>
          </motion.div>
        ));
  };

  const renderInstructions = (instructions) => {
    if (!instructions) return <p>No instructions data available</p>;

    return Array.isArray(instructions) ? (
      <ol className="list-decimal pl-5 mb-4">
        {instructions.map((instruction, i) => {
          if (typeof instruction === "string") {
            return (
              <motion.li
                key={i}
                className="mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                {instruction}
              </motion.li>
            );
          } else if (typeof instruction === "object" && instruction !== null) {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h5 className="font-semibold">
                  {instruction.step || `Step ${i + 1}`}
                </h5>
                <ul className="list-disc pl-5">
                  {Array.isArray(instruction.details) ? (
                    instruction.details.map((detail, j) => (
                      <motion.li
                        key={j}
                        className="mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: j * 0.1 }}
                      >
                        {detail}
                      </motion.li>
                    ))
                  ) : (
                    <motion.li
                      key={i}
                      className="mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      {instruction.details || "No details available"}
                    </motion.li>
                  )}
                </ul>
              </motion.div>
            );
          } else {
            return (
              <motion.li
                key={i}
                className="mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                Invalid instruction format
              </motion.li>
            );
          }
        })}
      </ol>
    ) : (
      <p>Instructions should be an array</p>
    );
  };

  const renderTips = (tips) => {
    if (!tips) return <p>No tips data available</p>;

    return Array.isArray(tips) ? (
      tips.map((tip, i) => (
        <motion.li
          key={i}
          className="mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          {tip}
        </motion.li>
      ))
    ) : (
      <p>Tips should be an array</p>
    );
  };

  const renderVariations = (variations) => {
    if (!variations) return <p>No variations data available</p>;

    return Array.isArray(variations) ? (
      variations.map((variation, i) => (
        <motion.li
          key={i}
          className="mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          {variation}
        </motion.li>
      ))
    ) : (
      <p>Variations should be an array</p>
    );
  };

  if (error)
    return (
      <motion.p
        className="text-red-500 text-center mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Error: {error}
      </motion.p>
    );
  if (recipes.length === 0)
    return (
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
    <div className="bg-custom-gradient-9 min-h-screen p-10">
      <h1 className="text-4xl md:text-5xl text-white font-extrabold text-center mb-8 uppercase tracking-widest">
        Indian Cuisine
      </h1>
      <hr className="mb-8" />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {recipes.map((recipe) => (
          <motion.div
            key={recipe._id}
            className="shadow-xl rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500 border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onClick={() => toggleRecipeDetails(recipe._id)}
          >
            <div className="p-4 text-white">
              <motion.h2
                className="text-sm tracking-wider font-semibold text-center transition-colors"
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

      {expandedRecipeId && (
        <motion.div
          className="fixed inset-0 text-white z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-custom-gradient-9 p-10 rounded-lg shadow-2xl max-w-3xl w-full max-h-screen  relative overflow-y-auto scrollbar-custom"
            initial={{ opacity: 0, scale: 0.9, x: "50%", y: "50%" }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: "50%", y: "50%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <button
              className="absolute top-10 right-4 text-slate-100 hover:text-gray-200 transition-colors"
              onClick={closePopup}
            >
              <AiOutlineClose size={28} />
            </button>
            <div className="mb-6">
              <h2 className="text-3xl text-white tracking-wider font-semibold mb-4 text-center uppercase">
                {recipes.find((recipe) => recipe._id === expandedRecipeId).name}
              </h2>
              <h3 className="text-2xl tracking-wider font-semibold mb-3">
                Ingredients :
              </h3>
              <ul className="list-disc pl-5 mb-4">
                {renderIngredients(
                  recipes.find((recipe) => recipe._id === expandedRecipeId)
                    .ingredients
                )}
              </ul>
              <h3 className="text-2xl tracking-wider font-semibold mb-3">
                Instructions :
              </h3>
              {renderInstructions(
                recipes.find((recipe) => recipe._id === expandedRecipeId)
                  .instructions
              )}
              <h3 className="text-2xl tracking-wider font-semibold mb-3">
                Tips :
              </h3>
              <ul className="list-disc pl-5 mb-4">
                {renderTips(
                  recipes.find((recipe) => recipe._id === expandedRecipeId).tips
                )}
              </ul>
              <h3 className="text-2xl tracking-wider font-semibold mb-3">
                Variations :
              </h3>
              <ul className="list-disc pl-5 mb-4">
                {renderVariations(
                  recipes.find((recipe) => recipe._id === expandedRecipeId)
                    .variations
                )}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default IndianCuisine;
