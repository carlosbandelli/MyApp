import api from '../api';

export const loginUser = async (email: string, password: string) => {
  try {
    console.log('Dados enviados para API:', { email, password });

    const response = await api.post('auth/login', { email, password });

    console.log('Resposta bruta da API:', response);
    console.log('Dados da resposta:', response.data);

    return response.data;
  } catch (error: any) {
    console.error('Erro na requisição:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config, // Isso mostrará os dados da requisição
    });
    throw error;
  }
};

export const registerUser = async (email: string, password: string) => {
  const response = await api.post('auth/register', { email, password });
  return response.data;
};
