// // src/services/api.js

// import axios from 'axios';

// // const apiUrl = 'http://localhost:5000'; // Update with your backend URL

// export const getCulinaryDetails = async (dish) => {
//     try {
//         const response = await axios.post(`${apiUrl}/api/culinary/details/`, { dish });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching culinary details:', error);
//         throw error;
//     }
// };

// export const getBeautyDetails = async (input) => {
//     try {
//         const response = await axios.post(`${apiUrl}/api/beauty/`, { input });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching beauty details:', error);
//         throw error;
//     }
// };

// export const getMedicinalDetails = async (input) => {
//     try {
//         const response = await axios.post(`${apiUrl}/api/medicinal/`, { input });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching medicinal details:', error);
//         throw error;
//     }
// };

// export const getPregnancyDetails = async (input) => {
//     try {
//         const response = await axios.post(`${apiUrl}/api/pregnancy/`, { input });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching pregnancy details:', error);
//         throw error;
//     }
// };
