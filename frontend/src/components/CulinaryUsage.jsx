import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const cuisines = [
  { name: 'Indian Cuisine', description: 'Explore the rich and diverse flavors of Indian dishes.', color: 'bg-red-500', route: '/indian-cuisine' },
  { name: 'European Cuisine', description: 'Discover the variety of traditional and modern European recipes.', color: 'bg-blue-500', route: '/european-cuisine' },
  { name: 'Japanese Cuisine', description: 'Delve into the art of Japanese cooking, from sushi to ramen.', color: 'bg-green-500', route: '/japanese-cuisine' },
  { name: 'American Cuisine', description: 'Enjoy classic and contemporary American dishes.', color: 'bg-yellow-500', route: '/american-cuisine' },
  { name: 'Australian Cuisine', description: 'Taste the unique flavors of Australian culinary creations.', color: 'bg-orange-500', route: '/australian-cuisine' },
  { name: 'Arabian Cuisine', description: 'Savor the rich and aromatic dishes from the Arabian Peninsula.', color: 'bg-purple-500', route: '/arabian-cuisine' },
];

const CulinaryUsage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Section */}
      <motion.section
        className="relative bg-gradient-to-r from-yellow-500 to-yellow-700 flex items-center justify-center h-1/2 text-white overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <h1 className="relative text-5xl font-extrabold text-center z-10 shadow-md w-full py-20">
          Culinary Uses of Saffron
        </h1>
      </motion.section>

      {/* Cuisine Grid Section */}
      <section className="flex-grow py-12 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {cuisines.map((cuisine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={cuisine.route}
                  className={`relative p-8 rounded-3xl shadow-lg text-center ${cuisine.color} text-white flex flex-col justify-between overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out`}
                >
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">{cuisine.name}</h2>
                    <p className="text-gray-100 text-lg">{cuisine.description}</p>
                  </div>
                  <div className="absolute inset-0 opacity-10 bg-black"></div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CulinaryUsage;
