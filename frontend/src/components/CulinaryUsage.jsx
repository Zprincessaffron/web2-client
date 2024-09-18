import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import culinaryImg from '/useCaseImg.jpg'; // Ensure the path is correct

const cuisines = [
  { name: 'Indian Cuisine', description: 'Explore the rich and diverse flavors of Indian dishes.', route: '/indian-cuisine'},
  { name: 'European Cuisine', description: 'Discover the variety of traditional and modern European recipes.', route: '/european-cuisine' },
  { name: 'Japanese Cuisine', description: 'Delve into the art of Japanese cooking, from sushi to ramen.', route: '/japanese-cuisine' },
  { name: 'American Cuisine', description: 'Enjoy classic and contemporary American dishes.', route: '/american-cuisine' },
  { name: 'Australian Cuisine', description: 'Taste the unique flavors of Australian culinary creations.', route: '/australian-cuisine' },
  { name: 'Arabian Cuisine', description: 'Savor the rich and aromatic dishes from the Arabian Peninsula.', route: '/arabian-cuisine' },
];

const CulinaryUsage = () => {
  const location = useLocation();
    const { user, userIdParams } = location.state || {};
    console.log(user);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <motion.section
        className="relative bg-cover bg-center h-1/2 text-white overflow-hidden"
        style={{ backgroundImage: `url(${culinaryImg})` }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <h1 className="relative tracking-[10px] text-3xl md:text-5xl font-medium text-center z-10 shadow-md w-full py-20">
          CULINARY USES OF SAFFRON
        </h1>
      </motion.section>

      {/* Cuisine Grid Section */}
      <section className="flex-grow py-12 bg-custom-gradient-3">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {cuisines.map((cuisine, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col h-full"
              >
                <Link
                  to={cuisine.route}
                  state={{user, userIdParams}}
                  className="relative p-8 rounded-full bg-custom-gradient-3 shadow-lg text-center text-white border flex flex-col justify-between overflow-hidden h-full transform hover:scale-105 hover:bg-red-400 hover:text-white hover:shadow-2xl transition-all duration-300 ease-in-out"
                >
                  <div className="relative z-10">
                    <h2 className="text-lg md:text-2xl uppercase tracking-[3px] font-medium mb-4">{cuisine.name}</h2>
                    <p className="tracking-widest text-[10px] md:text-[12px]">{cuisine.description}</p>
                  </div>
                  <div className="absolute inset-0 opacity-5 bg-black"></div>
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
