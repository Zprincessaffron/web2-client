import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UseCases = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <motion.section
        className="relative bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center h-1/3 text-white overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <h1 className="relative text-4xl font-extrabold text-center z-10">
          Saffron Use Cases
        </h1>
      </motion.section>

      {/* Use Cases Grid */}
      <section className="flex-grow bg-gray-100 flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-red-50 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/culinary">
                <h2 className="text-2xl font-semibold mb-4">Culinary</h2>
                <p className="text-gray-700">
                  Explore the culinary uses of saffron in various recipes.
                </p>
              </Link>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-yellow-50 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/cosmetic">
                <h2 className="text-2xl font-semibold mb-4">Cosmetic</h2>
                <p className="text-gray-700">
                  Discover saffron's benefits for skin and beauty products.
                </p>
              </Link>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-green-50 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/medicinal">
                <h2 className="text-2xl font-semibold mb-4">Medicinal</h2>
                <p className="text-gray-700">
                  Learn about saffron's medicinal properties and uses.
                </p>
              </Link>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg text-center hover:bg-blue-50 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/pregnant-women">
                <h2 className="text-2xl font-semibold mb-4">Pregnant Women</h2>
                <p className="text-gray-700">
                  Find information on saffron use during pregnancy.
                </p>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UseCases;
