import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_APP_NODE_ENV': JSON.stringify(process.env.VITE_APP_NODE_ENV),
    'process.env.VITE_APP_SERVER_BASE_URL': JSON.stringify(process.env.VITE_APP_SERVER_BASE_URL),
  },
});
