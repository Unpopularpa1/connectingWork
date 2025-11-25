import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token") || "";
    // console.log("Token being sent:", accessToken); 

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
