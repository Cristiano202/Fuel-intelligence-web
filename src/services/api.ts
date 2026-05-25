import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://-combustivel-3.onrender.com/api';

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de erro
api.interceptors.response.use(
  response => response,
  error => {
    console.error('[API Error]', error.message);
    return Promise.reject(error);
  }
);