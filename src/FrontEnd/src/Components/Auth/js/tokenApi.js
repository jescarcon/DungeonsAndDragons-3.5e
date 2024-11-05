import axios from "axios";
import { ACCESS_TOKEN } from "../../constants";
import { BASE_API_URL } from "../../constants";
import { USERNAME } from "../../constants";

const api = axios.create({
  baseURL: BASE_API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    const username = localStorage.getItem(USERNAME);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (username) {
      config.headers.Username = username;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
