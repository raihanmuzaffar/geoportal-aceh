import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1', 
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Sisipkan token di setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Tangani error HTTP secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token expired / Belum login
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    } 
    else if (status === 500 || status === 502) {
      // Error server
      console.error("Server Error tertangkap:", error);
    }

    return Promise.reject(error);
  }
);

export default api;