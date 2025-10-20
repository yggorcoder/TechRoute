// src/context/authContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // { username }

  // carrega token salvo (se houver)
  useEffect(() => {
    const t = localStorage.getItem("access_token");
    if (t) setToken(t);
  }, []);

  async function login(username, password) {
    // 👇 envia FORM-URLENCODED e usa "username" (não e-mail)
    const data = await authService.login(username, password);
    const t = data?.access_token;
    if (!t) throw new Error("Token não recebido da API");

    localStorage.setItem("access_token", t);
    setToken(t);
    setUser({ username });
    return true;
  }

  function logout() {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

