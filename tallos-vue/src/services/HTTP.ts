import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,   
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});