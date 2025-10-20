// src/api.js
import axios from "axios";

// Lê a URL do backend do .env / Secret do GitHub Actions
const RAW = import.meta.env.VITE_API_URL || "";

// Remove barras no final (evita //auth/register)
export const API_URL = RAW.replace(/\/+$/, "");

// Valida: precisa ser absoluta (http/https), senão vira chamada relativa ao SWA
if (!API_URL.startsWith("http")) {
  throw new Error(
    "VITE_API_URL inválida. Defina com http(s)://, ex.: " +
      "https://techroute-api-yggor-2-e8dcazckehcyfpgy.canadacentral-01.azurewebsites.net"
  );
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ---- Endpoints ----
export const health = () => api.get("/health");

export const register = (data) => api.post("/auth/register", data);

// OAuth2 password flow: form-encoded
export const login = ({ username, password }) =>
  api.post("/auth/login", new URLSearchParams({ username, password }), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

