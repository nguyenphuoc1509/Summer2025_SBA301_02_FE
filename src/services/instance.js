import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1",
  withCredentials: true,
  timeout: 30000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
});

instance.interceptors.response.use(function (response) {
  return response.data;
});
