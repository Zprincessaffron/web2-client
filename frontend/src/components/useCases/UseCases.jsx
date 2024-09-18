import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useCaseImg from '/useCaseImg-1.jpg';

const UseCases = () => {
    const location = useLocation();
    const { user,userIdParams } = location.state || {};
    console.log(userIdParams)
  return (
    <div className="flex flex-col h-screen">
      {/* Header Section */}
      <motion.section
        className="relative bg-cover bg-center flex items-center justify-center md:h-1/3 h-[25%] text-white overflow-hidden"
        style={{ backgroundImage: `url(${useCaseImg})` }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-black opacity-20"></div> {/* Darker Overlay */}
        <h1 className="relative tracking-[10px] text-3xl md:text-5xl font-medium text-center z-10">
          SAFFRON USE CASES
        </h1>
      </motion.section>

      {/* Use Cases Grid */}
      <section className="flex-grow bg-custom-gradient-7 flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-10"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              className="bg-custom-gradient-7 border rounded-full text-white p-6 shadow-lg text-center transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to='/culinary' state={{user, userIdParams}}>
                <h2 className="text-lg md:text-2xl font-medium mb-4 uppercase tracking-[5px]">Culinary</h2>
                <p className='tracking-widest text-[10px] md:text-[12px] '>
                  Explore the culinary uses of saffron in various recipes.
                </p>
              </Link>
            </motion.div>

            <motion.div
              className="bg-custom-gradient-7 border rounded-full text-white p-6 shadow-lg text-center transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/cosmetic" state={{user}}>
                <h2 className="text-lg md:text-2xl font-medium mb-4 uppercase tracking-[5px]">Cosmetic</h2>
                <p className='tracking-widest text-[10px] md:text-[12px]'>
                  Discover saffron's benefits for skin and beauty products.
                </p>
              </Link>
            </motion.div>

            <motion.div
              className="bg-custom-gradient-7 border rounded-full text-white p-6 shadow-lg text-center transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/medicinal" state={{user}}>
                <h2 className="text-lg md:text-2xl font-medium mb-4 uppercase tracking-[5px]">Medicinal</h2>
                <p className='tracking-widest text-[10px] md:text-[12px]'>
                  Learn about saffron's medicinal properties and uses.
                </p>
              </Link>
            </motion.div>

            <motion.div
              className="bg-custom-gradient-7 border rounded-full text-white p-6 shadow-lg text-center transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/pregnant-women" state={{user}}>
                <h2 className="text-lg md:text-2xl font-medium mb-4 uppercase tracking-[5px]">Pregnancy</h2>
                <p className='tracking-widest text-[10px] md:text-[12px]'>
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
