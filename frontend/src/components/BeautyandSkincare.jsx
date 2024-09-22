import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';
import './Scrollbar.css'; // Import the custom scrollbar CSS
import { useLocation } from 'react-router-dom';
import { IoIosCloseCircleOutline } from "react-icons/io";

const BeautyandSkincare = () => {
  const [skincareData, setSkincareData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null); // State for tracking expanded item
  const location = useLocation();
  const {user, userIdParams} = location.state || {}
  console.log(user);
  console.log(userIdParams)

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

  const [displayedItems, setDisplayedItems] = useState(skincareData);

  useEffect(() => {
    if (userIdParams) {
      setDisplayedItems(skincareData?.slice(0, 3));
     
    } else {
      setDisplayedItems(skincareData);
    }
  }, [userIdParams, skincareData]);


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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-custom-gradient-2 p-8 rounded-lg shadow-lg md:w-full w-[90%] max-w-lg relative">
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

  const handleClick = (item, index) => {
    if (!userIdParams || index <= 2) {
      toggleItemDetails(item);
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
        {skincareData.map((item, index) => (
          <motion.div
            key={item._id}
            className={`shadow-xl rounded-full overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-500 border ${
              userIdParams && index > 2 ? "cursor-not-allowed opacity-10%" : ""
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            // onClick={() => toggleItemDetails(item)}
            onClick={() => handleClick(item, index)}
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
                {item.target}
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
