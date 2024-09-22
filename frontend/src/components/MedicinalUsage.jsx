import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import './Scrollbar.css'; // Import the custom scrollbar CSS
import { useLocation } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";

const MedicinalUsage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null); // State for tracking expanded item
  const [clickedPosition, setClickedPosition] = useState({ top: 0, left: 0 });
  const itemRefs = useRef([]);
  const location = useLocation();
  const {user, userIdParams} = location.state || {}
  console.log(user);
  console.log(userIdParams)

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


  const [displayedUsages, setDisplayedUsages] = useState(data);

  useEffect(() => {
    if (userIdParams) {
      setDisplayedUsages(data?.slice(0, 3));
     
    } else {
      setDisplayedUsages(data);
    }
  }, [userIdParams, data]);


  const openUsageDetails = async (usage, index) => {
    // const rect = itemRefs.current[index].getBoundingClientRect();
    // setClickedPosition({ top: rect.top, left: rect.left });

    if (expandedItemId === usage._id) {
      setExpandedItemId(null);
      setSelectedUsage(null);
      return;
    }

    const userId = user?.uniqueId; 
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-custom-gradient p-8 rounded-lg shadow-lg md:w-full w-[90%] max-w-lg relative">
      <button
          onClick={onClose}
          className="absolute top-1 right-1 p-2 rounded-full text-white hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <IoIosCloseCircleOutline size={18}/>
          {/* <XIcon className="w-6 h-6 text-gray-600" /> */}
        </button>
        <p className="md:text-[15px] text-[13px] tracking-wider text-white">{message}</p>
      </div>
    </div>
    );
  };

  const handleClick = (usage, index) => {
    if (!userIdParams || index <= 2) {
      openUsageDetails(usage);
    } else {
      setModalMessage('To gain full access on our platform, you need to purchase a product. Once your order is delivered, you will receive a unique access ID along with a QR code in your shipment box. By scanning the QR code and entering your unique access ID on the site, you will unlock comprehensive access to our entire platform. Currently, you are in demo mode, which limits your access to certain features and content.');
      setIsModalOpen(true);
    }
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
            className={`shadow-xl rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500 border ${
              userIdParams && index > 2 ? "cursor-not-allowed opacity-10%" : ""
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            // onClick={() => openUsageDetails(usage, index)}
            // ref={el => itemRefs.current[index] = el}
            onClick={() => handleClick(usage, index)}
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
                {usage.condition}
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
