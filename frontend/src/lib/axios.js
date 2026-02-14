import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = apiUrl ? `${apiUrl.replace(/\/$/, "")}/api` : "/api";

export const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
});