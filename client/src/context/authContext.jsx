import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from 'jwt-decode'; // corrigido para a importação correta
import authService from "../services/authService";
import { api } from '../api';

// 1. Cria o contexto
const AuthContext = createContext(null);

// 2. Cria o provedor do contexto (o componente que vai envolver nosso app)
export const AuthProvider = ({ children }) => {
  // Estados para armazenar o token e os dados do usuário
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // useEffect vai rodar quando o componente montar e sempre que o 'token' mudar
  useEffect(() => {
    if (token) {
      try {
      // Tenta decodificar o token. Se for inválido, vai pular para o catch.
      const decodedUser = jwtDecode(token);
      // Se a decodificação deu certo, o token é válido
      // Armazena o token para persistir a sessão e configura o cabeçalho da API.
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ username: decodedUser.sub, role: decodedUser.role});
  }   catch (error) {
      // Se o token for inválido ou expirado, jwt-decode lança um erro.
      console.error("Falha ao decodificar o token. Realizando logout.", error);
      // Limpa o token inválido do estado, o que vai acionar o 'else' deste useEffect.
      setToken(null);
    }
  } else {
    // Se não há token, remove do localStorage e do cabeçalho da API.
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  }
}, [token]);

// Função de login que será chaamda pelos componentes
const login = async (username, password) => {
    const response = await authService.login(username, password);
    const newToken = response.data.access_token;
    setToken(newToken); //Atualiza o estado do token, disparando o useEffect
};

//Função de logout
const logout = () => {
    setToken(null); // limpa o estado do token, disparando o useEffect
};

// o valor que será fornecido para todos os componentes filhos
const value = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token, //um booleano para verificar facilmente se está autenticado
};

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. cria um hook customizado para facilitar o uso do contexto
export const useAuth = () => {
    return useContext(AuthContext);
};
