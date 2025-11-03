import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // set if you use cookies
});

// optional: interceptors for auth refresh
api.interceptors.response.use(
  res => res,
  async err => {
    return Promise.reject(err);
  }
);

export default api;
