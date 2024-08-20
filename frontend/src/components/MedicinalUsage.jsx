import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const MedicinalUsage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);

  useEffect(() => {
    axios.get('/api/medicinalusage')
      .then(response => {
        setData(response.data);
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
    <div className="bg-green-50 min-h-screen p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-green-600">Medicinal Usage</h1>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data && data.map((usage, index) => (
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
                className="text-2xl font-semibold mb-4 text-center text-green-600 hover:text-green-800 transition-colors"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {usage.condition}
              </motion.h2>
              {expandedItemId === index && (
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 mb-4">{usage.mechanism}</p>
                  <ul className="list-disc pl-5">
                    {usage.usage.map((method, idx) => (
                      <motion.li
                        key={idx}
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                      >
                        <h3 className="text-xl font-semibold">{method.method}</h3>
                        <p><strong>Ingredients:</strong> {method.ingredients.join(', ')}</p>
                        <p><strong>Preparation:</strong> {method.preparation}</p>
                        <p><strong>Consumption:</strong> {method.consumption}</p>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MedicinalUsage;
