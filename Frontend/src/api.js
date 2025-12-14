import axios from 'axios';

//Check environment variable
const isProduction = import.meta.env.PROD;

const baseURL = isProduction 
      ? import.meta.env.VITE_API_BASE_URL
      : 'http://localhost:5000/api';


const API = axios.create({
  baseURL: baseURL, // Matches the backend URL/port
});

export const createProduct = (data) => API.post('/products', data);
export const increaseStock = (id, quantity) => API.post(`/products/${id}/increase`, { quantity });
export const decreaseStock = (id, quantity) => API.post(`/products/${id}/decrease`, { quantity });
export const getProductSummary = (id) => API.get(`/products/${id}`);
export const getTransactionHistory = (id) => API.get(`/products/${id}/transactions`);