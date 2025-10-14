import axios from 'axios';

//Define a URL base da API
//Em um projeto maior, isso viria de uma variável de ambiente.
const API_URL = 'http://127.0.0.1:8000';

//Cria uma instâncai do axios para não precisar repetir a URL base
const apiClient = axios.create({
    baseURL: API_URL,
});

const authService = {
    /**
     * Envia as credenciais para o endpoint de login
     * @param {string} username
     * @param {string} password
     * @returns {Promise<object>} A resposta da API, contendo o token.
     */
    login: (username, password) => {
        //o backend espera dados de formulário para o login
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        return apiClient.post('/login', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
},

/**
 * Envia os dados do novo usuário para o endpoint de registro
 * @param {object} userData - { username, email, password, role}
 * @returns {Promise<object>} A resposta da API com os dados do usuário criado.
 */
register: (userData) => {
    return apiClient.post('/register', userData);

},
};

export { apiClient};
export default authService;

//