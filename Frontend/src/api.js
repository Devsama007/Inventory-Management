import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Matches the backend URL/port
});

export const createProduct = (data) => API.post('/products', data);
export const increaseStock = (id, quantity) => API.post(`/products/${id}/increase`, { quantity });
export const decreaseStock = (id, quantity) => API.post(`/products/${id}/decrease`, { quantity });
export const getProductSummary = (id) => API.get(`/products/${id}`);
export const getTransactionHistory = (id) => API.get(`/products/${id}/transactions`);