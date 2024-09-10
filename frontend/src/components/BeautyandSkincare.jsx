import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import './Scrollbar.css'; // Import the custom scrollbar CSS
import { useLocation } from 'react-router-dom';

const BeautyandSkincare = () => {
  const [skincareData, setSkincareData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null); // State for tracking expanded item
  const location = useLocation();
  const { user } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/beautyandskincare');
        setSkincareData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const toggleItemDetails = async (item) => {
    if (expandedItemId === item._id) {
      setExpandedItemId(null);
      setSelectedItem(null);
      return;
    }

    const userId = user?.uniqueId ;
    try {
      await axios.post('/api/store-interaction', {
        userId: userId,
        itemId: item._id,
        itemName: item.target,
        useCase: 'Cosmetic',
        category: 'Beauty and Skincare' // Update the category if needed
      });

      setExpandedItemId(item._id);
      setSelectedItem(item);
    } catch (err) {
      console.error('Failed to store interaction:', err);
    }
  };

  const closeItemDetails = () => {
    setExpandedItemId(null);
    setSelectedItem(null);
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
  
  if (skincareData.length === 0) return (
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
    <div className="bg-custom-gradient-2 min-h-screen p-10">
      <h1 className="text-2xl md:text-5xl text-white font-medium text-center mb-8 uppercase tracking-widest">
        Beauty and Skincare
      </h1>
      <hr className="mb-8" />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {skincareData.map((item) => (
          <motion.div
            key={item._id}
            className="shadow-xl rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500 border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onClick={() => toggleItemDetails(item)}
          >
            <div className="p-4 text-white">
              <motion.h2
                className="text-sm tracking-wider font-medium text-center transition-colors"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {item.target}
              </motion.h2>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedItem && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-custom-gradient-2 p-10 rounded-lg shadow-2xl max-w-3xl w-full max-h-screen relative overflow-y-auto scrollbar-custom"
            initial={{ opacity: 0, scale: 0.9, x: "50%", y: "50%" }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: "50%", y: "50%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <button
              className="absolute top-10 right-4 text-slate-100 hover:text-gray-200 transition-colors"
              onClick={closeItemDetails}
            >
              <AiOutlineClose size={28} />
            </button>
            <h2 className="md:text-3xl text-md text-white tracking-widest font-medium mb-3 text-center uppercase">
              {selectedItem.target}
            </h2>
            <div className="max-h-[70vh] overflow-y-auto p-2 text-white scrollbar-custom">
              <p className="font-medium tracking-wider mb-3">{selectedItem.name} :</p>
              <h3 className="md:text-2xl text-lg tracking-widest font-medium mb-3">Ingredients:</h3>
              <ul className="list-disc text-sm pl-3 ">
                {selectedItem.ingredients.map((ingredient, idx) => (
                  <motion.li
                    key={idx}
                    className=""
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    {ingredient.quantity} of {ingredient.name}
                  </motion.li>
                ))}
              </ul>

              <h3 className="md:text-2xl text-lg tracking-widest font-medium my-3">Preparation:</h3>
              <ol className="list-disc text-sm pl-3">
                {selectedItem.preparation.map((step, idx) => (
                  <motion.li
                    key={idx}
                    className="mb-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    {step}
                  </motion.li>
                ))}
              </ol>

              <h3 className="md:text-2xl text-lg tracking-widest font-medium my-3">Application:</h3>
              <ol className="list-disc text-sm pl-3">
                {selectedItem.application.map((step, idx) => (
                  <motion.li
                    key={idx}
                    className="mb-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    {step}
                  </motion.li>
                ))}
              </ol>

              <p className="text-white list-disc text-sm mt-4"><strong className='md:text-2xl text-lg pb-3'>Frequency:</strong> <br /> <li className='pt-2'>{selectedItem.frequency}</li></p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BeautyandSkincare;
