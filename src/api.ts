import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://server-supermarket-api.onrender.com/',
});

// Interceptor para adicionar o token no cabeçalho Authorization
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token'); // Ajuste o nome da chave se necessário
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
