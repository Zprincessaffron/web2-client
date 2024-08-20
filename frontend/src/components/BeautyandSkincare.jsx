import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const BeautyandSkincare = () => {
  const [skincareData, setSkincareData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);

  useEffect(() => {
    axios.get('/api/beautyandskincare')
      .then(response => {
        setSkincareData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const toggleItemDetails = (index) => {
    setExpandedItemId(expandedItemId === index ? null : index);
  };

  if (loading) return <p className="text-gray-500 text-center mt-4">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-4">Error: {error.message}</p>;

  return (
    <div className="bg-purple-50 min-h-screen p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-purple-600">Beauty And Skincare</h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skincareData && skincareData.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div
              className="cursor-pointer p-6"
              onClick={() => toggleItemDetails(index)}
            >
              <motion.h2
                className="text-2xl font-semibold mb-4 text-center text-purple-600 hover:text-purple-800 transition-colors"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {item.name}
              </motion.h2>
              {expandedItemId === index && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mb-4 text-gray-600">Target: {item.target}</p>

                  <h3 className="text-xl font-semibold mt-4">Ingredients:</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {item.ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient.quantity} of {ingredient.name}</li>
                    ))}
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-4">Preparation:</h3>
                  <ol className="list-decimal pl-5 mb-4">
                    {item.preparation.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                  
                  <h3 className="text-xl font-semibold mt-4">Application:</h3>
                  <ol className="list-decimal pl-5 mb-4">
                    {item.application.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                  
                  <p className="text-gray-600 mt-4">Frequency: {item.frequency}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BeautyandSkincare;
