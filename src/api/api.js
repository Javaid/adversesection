import axios from "axios";
import { clearAuthSession, getToken } from "../utils/auth";
import { API_BASE_URL } from "../config/apiConfig";

//  axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

//  token  is attach automatically on every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle invalid or expired token globally(interceptor)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuthSession();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
