import React from 'react';
import ReactDOM from 'react-dom/client';
import "regenerator-runtime/runtime.js"; // Ensure this is installed and correctly set up
import App from './App.jsx'; // Check if this file exists and is correctly exported
import './index.css';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Log environment variables
console.log("import.meta.env:", import.meta.env);
console.log("import.meta.env.VITE_APP_NODE_ENV:", import.meta.env.VITE_APP_NODE_ENV);
console.log("import.meta.env.VITE_APP_SERVER_BASE_URL:", import.meta.env.VITE_APP_SERVER_BASE_URL);

// Set axios base URL based on environment
axios.defaults.baseURL = import.meta.env.VITE_APP_NODE_ENV === "development"
  ? import.meta.env.VITE_APP_LOCAL_BASE_URL
  : import.meta.env.VITE_APP_SERVER_BASE_URL;

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);



// http://localhost:5000
// https://web2-server-rho.vercel.app