import axios from "axios";

//  axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

//  token  is attach automatically on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
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
      
      localStorage.removeItem("token");
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default api;
