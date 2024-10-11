import api from '../api';

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (email: string, password: string) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};
