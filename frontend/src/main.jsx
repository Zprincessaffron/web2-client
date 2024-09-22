import React from 'react';
import ReactDOM from 'react-dom/client';
import "regenerator-runtime/runtime.js";
import App from './App.jsx';
import './index.css';
import axios from 'axios';

// Log environment variables
// console.log("import.meta.env:", import.meta.env);
// console.log("import.meta.env.VITE_APP_NODE_ENV:", import.meta.env.VITE_APP_NODE_ENV);
// console.log("import.meta.env.VITE_APP_SERVER_BASE_URL:", import.meta.env.VITE_APP_SERVER_BASE_URL);

// Set axios base URL based on environment
axios.defaults.baseURL = import.meta.env.VITE_APP_NODE_ENV === "development"
  ? "http://localhost:8080"
  : "http://3.91.104.175:8080";

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);

