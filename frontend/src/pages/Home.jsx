import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import mainImg from '/main-1.jpg';
import secondaryImg from '/mainImg-2.0.jpg';
import siteImg from '/main-3.jpg';

const Home = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const location = useLocation();
  const { user } = location.state || {};
  const [userIdParams, setUserIdParams] = useState(null);
  const [demo, setDemo] = useState(false);
  
  // Define scroll-based opacity transformations for each section
  const firstSectionOpacity = useTransform(scrollY, [0, window.innerHeight], [1, 0.5]);
  const secondSectionOpacity = useTransform(scrollY, [window.innerHeight, 2 * window.innerHeight], [1, 0.5]);
  const thirdSectionOpacity = useTransform(scrollY, [2 * window.innerHeight, 3 * window.innerHeight], [1, 0.5]);

  // Extract the query parameters from the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const userIdFromUrl = searchParams.get('userId');
    const demoFromUrl = searchParams.get('demo') === 'true'; // Check if demo is true
    
    if (userIdFromUrl) {
      setUserIdParams(userIdFromUrl);
    }
    setDemo(demoFromUrl);

    // You can add additional verification logic here if needed
  }, [location.search]);


  return (
    <div className="flex flex-col">
      {/* Use Cases Section */}
      <motion.section
        className="relative flex items-center justify-center h-screen text-white overflow-hidden sticky top-0 z-10"
        style={{
          backgroundImage: `url(${mainImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'inset 0 0 10rem rgba(0, 0, 0, 0.5)',
          opacity: firstSectionOpacity,
        }}
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-40"></div>
        <div className="relative z-10 text-center px-6 md:px-12">
          <motion.h2
            className="text-3xl md:text-5xl font-medium md:tracking-[8px] tracking-widest leading-tight mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            DISCOVER SAFFRON BENEFITS
          </motion.h2>
          <motion.p
            className="text-[10px] md:text-[13px] mb-8 max-w-lg mx-auto tracking-[1px]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Explore the endless possibilities and benefits of saffron in your daily life.
          </motion.p>
          <motion.button
            className="bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-800 text-white tracking-[3px] md:text-[13px] text-[10px] py-2 px-12 md:py-2 md:px-16 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate('/use-cases', { state: { user, userIdParams , demo } })}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Learn More
          </motion.button>
        </div>
      </motion.section>

      {/* AI Suggested Recipe Section */}
      <motion.section
        className="relative flex items-center justify-center h-screen text-white overflow-hidden sticky top-0 z-20"
        style={{
          backgroundImage: `url(${secondaryImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed', 
          boxShadow: 'inset 0 0 10rem rgba(0, 0, 0, 0.5)',
          opacity: secondSectionOpacity,
        }}
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-50"></div>
        <div className="relative z-10 text-center px-6 md:px-12">
          <motion.h2
            className="text-3xl md:text-5xl font-medium md:tracking-[8px] tracking-widest leading-tight mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            AI SAFFRON SUGGESTION
          </motion.h2>
          <motion.p
            className="text-[10px] md:text-[13px] mb-8 max-w-lg mx-auto tracking-[2px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Get personalized saffron recipes and benefits recommendations powered by AI.
          </motion.p>
          <motion.button
            className="bg-gradient-to-r from-purple-300 to-purple-500 hover:from-purple-400 hover:to-purple-600 text-white tracking-[3px] md:text-[13px] text-[12px] py-2 px-12 md:py-2 md:px-16 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105"
            onClick={() => navigate('/ai-suggestion', { state: { user } })}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Explore More
          </motion.button>
        </div>
      </motion.section>

      {/* Upcoming Site Launch Section */}
      <motion.section
        className="relative flex items-center justify-center h-screen text-white overflow-hidden top-0 z-30"
        style={{
          backgroundImage: `url(${siteImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: 'inset 0 0 10rem rgba(0, 0, 0, 0.5)',
          opacity: thirdSectionOpacity,
        }}
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-40"></div>
        <div className="relative z-10 text-center px-6 md:px-12">
          <motion.h2
            className="text-3xl md:text-5xl font-medium md:tracking-[8px] tracking-widest leading-tight mb-4"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Z PRINCESS SAFFRON
          </motion.h2>
          <motion.p
            className="text-[10px] md:text-[13px] mb-8 max-w-lg mx-auto tracking-[2px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            We’re working on something amazing! Stay tuned for our upcoming site launch.
          </motion.p>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
