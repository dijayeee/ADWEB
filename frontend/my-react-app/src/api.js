import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000'
});

// Add token to headers if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const register = (name, email, password) =>
  API.post('/api/auth/register', { name, email, password });

export const login = (email, password) =>
  API.post('/api/auth/login', { email, password });

export const getBooks = () => API.get('/api/books/all');

export const addBook = (title, author, description) =>
  API.post('/api/books/add', { title, author, description });

export default API;
