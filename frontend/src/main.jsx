import React from 'react'
import ReactDOM from 'react-dom/client'
import "regenerator-runtime/runtime.js";
import App from './App.jsx'
import './index.css'
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';
// http://localhost:5000
// https://web2-server-rho.vercel.app
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App />
  // {/* </React.StrictMode>, */}
)
