import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:3333',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                console.error('Acesso não autorizado - verifique suas credenciais.');
            } else if (status === 404) {
                console.error('Recurso não encontrado - verifique a URL solicitada e o ID.');
            } else if (status === 500) {
                console.error('Erro Interno do Servidor - tente novamente mais tarde.');
            } else if (status === 400) {
                console.error(`Requisição inválida: ${data.message || 'Dados incorretos.'}`);
            } else {
                console.error(`Erro ${status}: ${data.message || 'Ocorreu um erro na resposta do servidor.'}`);
            }
        } 
        else if (error.request) {
            console.error('Erro de rede: Nenhuma resposta recebida do servidor. Verifique sua conexão e se o servidor está online.');
        } 
        else {
            console.error('Erro inesperado:', error.message);
        }

        return Promise.reject(error);
    }
)