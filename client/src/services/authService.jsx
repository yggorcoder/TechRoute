// src/services/authService.jsx
import { api } from "../api";

const authService = {
  /**
   * Login usando OAuth2 password flow (form-urlencoded).
   * O backend espera campos "username" e "password" no corpo (não JSON).
   */
  login: async (username, password) => {
    const form = new URLSearchParams();
    form.append("username", username.trim());
    form.append("password", password);

    const res = await api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return res.data; // { access_token, token_type }
  },

  /**
   * Registro de usuário (JSON).
   * role deve ser "manager" ou "technician" (minúsculo); normalizamos aqui.
   */
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

    const res = await api.post("/auth/register", payload);
    // sucesso pode ser 201 (Created) ou 200
    if (!(res.status === 200 || res.status === 201)) {
      throw new Error(`Register failed (${res.status})`);
    }
    return res.data; // { username, email, role }
  },

  health: async () => (await api.get("/health")).data,
};

export default authService;

