import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import welcomeImg from '/welcomeImg.jpg';

const WelcomePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = location.state || {}; // Access user data passed from UniqueIdForm
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [utterance, setUtterance] = useState(null);

    const greetingText = `Welcome, ${user ? user.name : 'Guest'}!`;
    const descriptionText = `Discover the luxurious world of saffron. From gourmet recipes to beauty secrets, our AI-powered suggester will guide you through exclusive recommendations tailored just for you.`;

    useEffect(() => {
        if (window.SpeechSynthesisUtterance) {
            const newUtterance = new SpeechSynthesisUtterance(`${greetingText} ${descriptionText}`);
            newUtterance.lang = 'en-US';
            newUtterance.voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Google UK English Female');
            setUtterance(newUtterance);

            // Start speaking
            window.speechSynthesis.speak(newUtterance);
            setIsSpeaking(true);

            // Clean up the speech synthesis when component unmounts
            return () => {
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                }
            };
        }
    }, [greetingText, descriptionText]);

    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            navigate('/home', { state: { user } });
        }, 15000); // 15 seconds

        // Clean up the timer if the component unmounts
        return () => clearTimeout(redirectTimer);
    }, [navigate, user]);

    const handleStopAndNavigate = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        navigate('/home', { state: { user } });
    };

    const splitText = text => text?.split(' ').map((word, index) => (
        <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            {word}{' '}
        </motion.span>
    ));

    const renderGreeting = () => {
        if (!user) {
            return splitText(greetingText);
        }

        const [start, name, end] = greetingText.split(' ');
        return (
            <>
                {splitText(start)}
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-slate-300 uppercase"
                >
                    {name}
                </motion.span>
                {splitText(end)}
            </>
        );
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${welcomeImg})` }}
        >
            <div className="absolute inset-0 bg-black opacity-10"></div> {/* Darker Overlay */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 text-center text-white"
            >
                <h1 className="text-2xl tracking-widest md:text-4xl font-medium mb-4">
                    {renderGreeting()}
                </h1>
                <p className="text-sm md:text-md md:px-20 px-10 tracking-widest mt-8">
                    {splitText(descriptionText)}
                </p>
                <button
                    onClick={handleStopAndNavigate}
                    className="mt-8 tracking-[3px]  md:text-[14px] text-[12px] py-2 px-12 md:py-2 md:px-16 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-full"
                >
                    Continue to Home
                </button>
            </motion.div>
        </div>
    );
};

export default WelcomePage;
