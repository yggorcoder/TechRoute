// src/services/authService.jsx
import { api } from "../api";

const authService = {
  login: async (username, password) => {
    const form = new URLSearchParams();
    form.append("username", username.trim());
    form.append("password", password);

    try {
      const res = await api.post("/auth/login", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      // sucesso: { access_token, token_type }
      return res.data;
    } catch (err) {
      // extrai mensagem do backend, se houver
      const detail =
        err?.response?.data?.detail ||
        err?.response?.statusText ||
        err?.message ||
        "Login failed";
      throw new Error(detail); // deixa o componente decidir o que mostrar
    }
  },

  register: async ({ username, email, password, role }) => {
    const payload = {
      username: username.trim(),
      email: email.trim(),
      password,
      role:
        String(role || "manager").toLowerCase() === "technician"
          ? "technician"
          : "manager",
    };
    try {
      const res = await api.post("/auth/register", payload);
      return res.data;
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        err?.response?.statusText ||
        err?.message ||
        "Registration failed";
      throw new Error(detail);
    }
  },
};

export default authService;

