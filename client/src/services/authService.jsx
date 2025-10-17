import { api } from '../api';

const authService = {
    /**
     * Envia as credenciais para o endpoint de login
     * @param {string} username
     * @param {string} password
     * @returns {Promise<object>} A resposta da API, contendo o token.
     */
    login: (username, password) => {
        return api.post('/auth/login', { email: username, password: password });
    },

    /**
     * Envia os dados do novo usuário para o endpoint de registro
     * @param {object} userData - { username, email, password, role}
     * @returns {Promise<object>} A resposta da API com os dados do usuário criado.
     */
    register: (userData) => {
        return api.post('/auth/register', userData);
    },
};

export default authService;
