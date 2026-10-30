import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1', // <-- Cukup gunakan ini, Vite akan meneruskannya ke backend
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default api;