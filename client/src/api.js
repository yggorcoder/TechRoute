import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ex.: https://techroute-api-yggor-2.azurewebsites.net
  // withCredentials: true, // habilitar apenas se for usar cookies/sessão
});

export const health = () => api.get("/health");
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
