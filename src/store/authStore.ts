import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  email: string;
  password: string;
  isLoading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  clearEmail: () => void;
  clearPassword: () => void;
  setIsLoading: (loading: boolean) => void;
  loadTokenFromStorage: () => Promise<void>; // Alterado para Promise
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  email: '',
  password: '',
  isLoading: false,

  setIsLoading: (loading) => set({ isLoading: loading }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),

  setToken: async (token) => {
    console.log('Salvando token no AsyncStorage:', token); // Log para acompanhar
    await AsyncStorage.setItem('token', token);
    set({ token });
  },

  clearToken: async () => {
    console.log('Removendo token do AsyncStorage');
    await AsyncStorage.removeItem('token');
    set({ token: null });
  },

  clearEmail: () => set({ email: '' }),
  clearPassword: () => set({ password: '' }),

  loadTokenFromStorage: async () => {
    set({ isLoading: true });
    try {
      const storedToken = await AsyncStorage.getItem('token');
      console.log('Token carregado do AsyncStorage:', storedToken); // Log para verificar
      set({ token: storedToken, isLoading: false });
    } catch (error) {
      console.error('Erro ao carregar o token do AsyncStorage:', error);
      set({ isLoading: false });
    }
  },
}));
