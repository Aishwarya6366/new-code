// import axios from "axios";

// const api = axios.create({
  
//   baseURL: "/api",
//   api: "http://localhost:8080",
//   withCredentials: true
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

/* 🔥 VERY IMPORTANT — SEND COOKIE ALWAYS */
api.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;