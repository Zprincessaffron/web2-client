import React from 'react'
import ReactDOM from 'react-dom/client'
import "regenerator-runtime/runtime.js";
import App from './App.jsx'
import './index.css'
import axios from 'axios';

console.log("import.meta.env", import.meta.env);
console.log("import.meta.env.VITE_NODE_ENV :", import.meta.env.VITE_APP_NODE_ENV);
console.log("import.meta.env.VITE_SERVER_BASE_URL :", import.meta.env.VITE_APP_SERVER_BASE_URL);

axios.defaults.baseURL = import.meta.env.VITE_APP_NODE_ENV === "development"
  ? import.meta.env.VITE_APP_LOCAL_BASE_URL
  : import.meta.env.VITE_APP_SERVER_BASE_URL;
// http://localhost:5000
// https://web2-server-rho.vercel.app
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App />
  // {/* </React.StrictMode>, */}
)
