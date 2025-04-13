import axios, { InternalAxiosRequestConfig } from "axios";
import store from "../redux/store";

const apiClient = axios.create({
  baseURL: "https://trackerbackv1-production.up.railway.app",
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;