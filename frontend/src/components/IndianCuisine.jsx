import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import "./Scrollbar.css"; // Import the custom scrollbar CSS
import { useLocation } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";

const IndianCuisine = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const location = useLocation();
  const { user, userIdParams } = location.state || {};
  console.log({user});
  console.log(userIdParams)

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

  const [displayedRecipes, setDisplayedRecipes] = useState(recipes);

  useEffect(() => {
    if (userIdParams) {
      setDisplayedRecipes(recipes.slice(0, 3));
     
    } else {
      setDisplayedRecipes(recipes);
    }
  }, [userIdParams, recipes]);

  const toggleRecipeDetails = async (id) => {
    if (expandedRecipeId === id) {
      setExpandedRecipeId(null);
      return;
    }
  
    const selectedRecipe = recipes.find((recipe) => recipe._id === id);
  
    try {
      const userId = user?.uniqueId; // Replace with the actual user ID
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
            <h4 className="font-medium">{key}</h4>
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
      <ol className="list-disc pl-5 text-sm mb-4">
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
                <h5 className="font-medium">
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

  const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-300 transition-colors"
          aria-label="Close"
        >
          <IoIosCloseCircleOutline/>
          {/* <XIcon className="w-6 h-6 text-gray-600" /> */}
        </button>
        <p className="text-md tracking-wider text-gray-700">{message}</p>
      </div>
    </div>
    );
  };
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleClick = (recipeId, index) => {
    if (!userIdParams || index <= 2) {
      toggleRecipeDetails(recipeId);
    } else {
      setModalMessage('To gain full access on our platform, you need to purchase a product. Once your order is delivered, you will receive a unique access ID along with a QR code in your shipment box. By scanning the QR code and entering your unique access ID on the site, you will unlock comprehensive access to our entire platform. Currently, you are in demo mode, which limits your access to certain features and content.');
      setIsModalOpen(true);
    }
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
        <h1 className="text-3xl md:text-5xl text-white font-medium text-center mb-8 uppercase tracking-widest">
          Indian Cuisine
        </h1>
        <hr className="mb-8" />
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {recipes.map((recipe, index) => (
        <motion.div
          key={recipe._id}
          className={`shadow-xl rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500 border ${
            userIdParams && index > 2 ? "cursor-not-allowed opacity-10%" : ""
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={() => handleClick(recipe._id, index)}
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
                <h2 className="md:text-3xl text-md text-white tracking-widest font-medium mb-4 text-center uppercase">
                  {recipes.find((recipe) => recipe._id === expandedRecipeId).name}
                </h2>
                <h3 className="md:text-2xl text-lg tracking-widest font-medium mb-3">
                  Ingredients :
                </h3>
                <ul className="list-disc text-sm pl-5 mb-4">
                  {renderIngredients(
                    recipes.find((recipe) => recipe._id === expandedRecipeId)
                      .ingredients
                  )}
                </ul>
                <h3 className="md:text-2xl text-lg tracking-widest font-medium mb-3">
                  Instructions :
                </h3>
                {renderInstructions(
                  recipes.find((recipe) => recipe._id === expandedRecipeId)
                    .instructions
                )}
                <h3 className="md:text-2xl text-lg tracking-widest font-medium mb-3">
                  Tips :
                </h3>
                <ul className="list-disc pl-5 text-sm  mb-4">
                  {renderTips(
                    recipes.find((recipe) => recipe._id === expandedRecipeId).tips
                  )}
                </ul>
                <h3 className="md:text-2xl text-lg tracking-widest font-medium mb-3">
                  Variations :
                </h3>
                <ul className="list-disc text-sm pl-5 mb-4">
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
