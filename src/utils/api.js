import axios from "axios";

const api = axios.create({
  // Use relative URL so it works when served from the same host (FastAPI)
  // or a full URL if Vite is used (with CORS)
  // allow config via env var used in Vercel/Netlify, or fallback to local
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api",
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn("Unauthorized! Redirecting to login...");
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
