import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Petals from "/pngwing.com (18).png";
import Threads from "/threads-1.png";

const InitialWelcome = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Set up a timer to redirect after 6 seconds
    const timer = setTimeout(() => {
      navigate("/verification");
    }, 6000); 

    // Cleanup timer if the component unmounts before the timer finishes
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative h-screen overflow-hidden flex flex-col justify-center items-center bg-black">
      {/* Background Gradient Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0"
      >
        <div className="h-full w-full bg-custom-gradient-2"></div>
      </motion.div>

      {/* Particle Animation */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ opacity: 0.5, scale: 1 }}
        animate={{ opacity: 0.5, scale: [1, 1.1] }} // Zooms in from scale 1 to 1.1
        transition={{
          duration: 6,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <div
          className="absolute inset-0 bg-contain bg-center opacity-50"
          style={{ backgroundImage: 'url("/pngwing.com (17).png")' }}
        ></div>
      </motion.div>

      {/* Petals Animation */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ y: "-20%" }}
        animate={{ y: "100%" }}
        transition={{
          duration: 6,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        <img
          src={Petals}
          alt="Petals"
          className="w-full h-auto opacity-75"
          style={{ objectFit: "cover" }}
        />
      </motion.div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col justify-center items-center space-y-4 px-4">
        {/* Main Text Animation */}
        <motion.h1
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 1.5 }}
          className="text-3xl uppercase md:text-4xl lg:text-5xl font-medium tracking-wide md:tracking-[10px] text-white text-shadow-glow text-center"
        >
          Welcome To Saffron Magic
        </motion.h1>

        {/* Secondary Text Animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 2 }}
          className="text-sm md:text-md tracking-[6px] font-medium text-white text-center"
        >
          Experience the finest saffron in the world.
        </motion.p>
      </div>
    </div>
  );
};

export default InitialWelcome;
