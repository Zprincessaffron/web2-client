import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import './Scrollbar.css'; // Import the custom scrollbar CSS
import { useLocation } from 'react-router-dom';

const MedicinalUsage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null); // State for tracking expanded item
  const [clickedPosition, setClickedPosition] = useState({ top: 0, left: 0 });
  const itemRefs = useRef([]);
  const location = useLocation();
  const { user } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/medicinalusage');
        setData(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const openUsageDetails = async (usage, index) => {
    const rect = itemRefs.current[index].getBoundingClientRect();
    setClickedPosition({ top: rect.top, left: rect.left });

    if (expandedItemId === usage._id) {
      setExpandedItemId(null);
      setSelectedUsage(null);
      return;
    }

    const userId = user.uniqueId; 
    try {
      await axios.post('/api/store-interaction', {
        userId: userId,
        itemId: usage._id,
        itemName: usage.condition,
        useCase: 'Medicinal',
        category: 'Medicinal Usage' 
      });

      setExpandedItemId(usage._id);
      setSelectedUsage(usage);
    } catch (err) {
      console.error('Failed to store interaction:', err);
    }
  };

  const closeUsageDetails = () => {
    setSelectedUsage(null);
    setExpandedItemId(null);
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
  
  if (!data) return (
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
    <div className="bg-custom-gradient min-h-screen p-10">
      <h1 className="text-3xl md:text-5xl text-white font-medium text-center mb-8 uppercase tracking-widest">
        Medicinal Usage
      </h1>
      <hr className="mb-8" />
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.map((usage, index) => (
          <motion.div
            key={usage._id}
            className="shadow-xl rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500 border"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onClick={() => openUsageDetails(usage, index)}
            ref={el => itemRefs.current[index] = el}
          >
            <div className="p-4 text-white">
              <motion.h2
                className="text-sm tracking-wider font-medium text-center transition-colors"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {usage.condition}
              </motion.h2>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedUsage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.div
            className="bg-custom-gradient p-10 rounded-lg shadow-2xl max-w-3xl w-full max-h-screen relative overflow-y-auto scrollbar-custom"
            initial={{ opacity: 0, scale: 0.9, x: clickedPosition.left, y: clickedPosition.top }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: clickedPosition.left, y: clickedPosition.top }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <button
              className="absolute top-10 right-4 text-slate-100 hover:text-gray-200 transition-colors"
              onClick={closeUsageDetails}
            >
              <AiOutlineClose size={28} />
            </button>
            <h2 className="md:text-3xl text-md text-white tracking-widest font-medium mb-8 text-center uppercase">
              {selectedUsage.condition}
            </h2>
            <div className="max-h-[70vh] overflow-y-auto p-4 text-white scrollbar-custom">
              <p className="tracking-wider mb-8">{selectedUsage.mechanism}</p>
              <ul className="list-disc text-sm pl-3 space-y-8">
                {selectedUsage.usage.map((method, idx) => (
                  <motion.li
                    key={idx}
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                  >
                    <h3 className="md:text-2xl text-lg tracking-widest font-medium pb-2">{method.method} :</h3>
                    <p className="tracking-wider pb-2">
                      <strong className="tracking-wider">Ingredients :</strong> {method.ingredients.join(', ')}
                    </p>
                    <p className="tracking-wide pb-2">
                      <strong className="tracking-wider">Preparation :</strong> {method.preparation}
                    </p>
                    <p className="tracking-wide">
                      <strong className="tracking-wider">Consumption :</strong> {method.consumption}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MedicinalUsage;
