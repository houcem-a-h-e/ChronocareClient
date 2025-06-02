// src/Api/flaskApi.js
import axios from 'axios';

const flaskApi = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor
flaskApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Flask API error:', error);
    return Promise.reject(error);
  }
);

export default flaskApi;