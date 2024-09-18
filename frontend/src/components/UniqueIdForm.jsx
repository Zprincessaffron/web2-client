import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import Petals from "/pngwing.com (18).png";
import "react-toastify/dist/ReactToastify.css";

const UniqueIdForm = () => {
  const [uniqueId, setUniqueId] = useState("");
  const [otp, setOtp] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // State for OTP
  const [isOtpVerified, setIsOtpVerified] = useState(false); // State for OTP verification

  // Registration form states
  const [name, setName] = useState("");
  const [contact, setContact] = useState(""); 
  const [password, setPassword] = useState("");
  const [purchasedSite, setPurchasedSite] = useState("");

  const navigate = useNavigate();

  // Handle verification of unique ID
  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verify-uniqueId", { uniqueId });

      if (response.status === 200 && response.data.userData) {
        toast.success("Unique ID verified successfully! Redirecting...");
        navigate("/welcome", { state: { user: response.data.userData } });
      } else {
        toast.error(
          response.data.message || "Verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again.");
    }
  };

  // Handle OTP submission
  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verify-otp", { otp });

      if (response.status === 200) {
        toast.success(
          "OTP verified successfully! Unique ID has been sent to your email/phone."
        );
        setIsOtpVerified(true);
        setTimeout(window.location.reload(), 2000);
        // Optionally handle any further actions, like registration completion
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      toast.error("OTP verification failed. Please try again.");
    }
  };

  // Handle registration submission
  const handleSubmitRegistration = async (e) => {
    e.preventDefault();

    if (!contact) {
      toast.error("Please provide your email or phone number.");
      return;
    }

    try {
      const response = await axios.post("/api/register", {
        name,
        contact,
        password,
        purchasedSite,
      });

      if (response.status === 201) {
        toast.success(
          "Registration successful! An OTP has been sent to your email/phone."
        );
        setIsOtpSent(true);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

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
      <div className="relative z-30 flex flex-col justify-center items-center space-y-4 px-4 max-w-full">
        {/* Main Text Animation */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0 }}
          // className="text-3xl uppercase md:text-5xl lg:text-6xl font-medium tracking-wide md:tracking-[10px] text-white text-shadow-glow text-center"
        >
          <ToastContainer />
          <AnimatePresence mode="wait">
            <motion.div
              key={isRegistering ? (isOtpSent ? "register" : "otp") : "verify"}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.5 }}
              className="relative flex items-center justify-center min-h-40 w-full"
            >
              <div className="w-full max-w-2xl p-6 bg-white bg-opacity-90 shadow-lg rounded-lg">
                {!isRegistering ? (
                  <>
                    <h2 className="text-2xl font-medium tracking-wider text-center text-gray-800 mb-4">
                      Verify Your Unique ID
                    </h2>
                    <form onSubmit={handleSubmitVerification}>
                      <div className="relative mb-4">
                        <label
                          htmlFor="uniqueId"
                          className="block text-sm font-medium tracking-wider text-gray-700"
                        >
                          Enter Unique ID
                        </label>
                        <input
                          type="text"
                          id="uniqueId"
                          value={uniqueId}
                          onChange={(e) => setUniqueId(e.target.value)}
                          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Your Unique ID"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-full font-medium shadow-md hover:shadow-lg transform transition duration-300 hover:-translate-y-1"
                      >
                        Verify
                      </button>
                    </form>
                    <p className="mt-4 text-center tracking-wider text-gray-600">
                      Don’t have a Unique ID?{" "}
                      <button
                        onClick={() => setIsRegistering(true)}
                        className="text-purple-600 tracking-wider hover:text-purple-700 font-medium rounded-full"
                      >
                        Register
                      </button>
                    </p>
                  </>
                ) : isOtpSent ? (
                  <>
                    <h2 className="text-2xl font-medium text-center tracking-widest text-gray-800 mb-4">
                      Verify OTP
                    </h2>
                    <form onSubmit={handleSubmitOtp}>
                      <div className="relative mb-4">
                        <label
                          htmlFor="otp"
                          className="block text-sm font-medium tracking-wider text-gray-700"
                        >
                          Enter OTP
                        </label>
                        <input
                          type="text"
                          id="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Your OTP"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-full font-medium shadow-md hover:shadow-lg transform transition duration-300 hover:-translate-y-1"
                      >
                        Verify OTP
                      </button>
                    </form>
                    <p className="mt-4 text-center tracking-wider text-gray-600">
                      <button
                        onClick={() => setIsRegistering(false)}
                        className="text-purple-600 tracking-wider hover:text-purple-700 font-medium rounded-full"
                      >
                        {"<-"} Click to verify UniqueID
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-medium text-center tracking-widest text-gray-800 mb-4">
                      Register
                    </h2>
                    <form
                      onSubmit={handleSubmitRegistration}
                      className="w-full max-w-4xl"
                    >
                      <div className="relative mb-4">
                        <label
                          htmlFor="name"
                          className="block text-sm tracking-wider font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Your Name"
                          required
                        />
                      </div>
                      <div className="relative mb-4">
                        <label
                          htmlFor="contact"
                          className="block text-sm tracking-wider font-medium text-gray-700"
                        >
                          Email or Phone
                        </label>
                        <input
                          type="text"
                          id="contact"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Your Email Address or Phone Number"
                          required
                        />
                      </div>
                      <div className="relative mb-4">
                        <label
                          htmlFor="password"
                          className="block text-sm tracking-wider font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Your Password"
                          required
                        />
                      </div>
                      <div className="relative mb-4">
                        <label
                          htmlFor="purchasedSite"
                          className="block text-sm tracking-wider font-medium text-gray-700"
                        >
                          Where did you purchase your saffron?
                        </label>
                        <input
                          type="text"
                          id="purchasedSite"
                          value={purchasedSite}
                          onChange={(e) => setPurchasedSite(e.target.value)}
                          className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          placeholder="Purchased Site"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-full font-medium shadow-md hover:shadow-lg transform transition duration-300 hover:-translate-y-1"
                      >
                        Register
                      </button>
                      <p className="mt-4 text-center tracking-wider text-gray-600">
                        <button
                          onClick={() => setIsRegistering(false)}
                          className="text-purple-600 tracking-wider hover:text-purple-700 font-medium rounded-full"
                        >
                          {"<-"} Back to verify
                        </button>
                      </p>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default UniqueIdForm;
