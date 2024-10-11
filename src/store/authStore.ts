// src/store/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: async (token: string) => {
    await AsyncStorage.setItem('token', token);
    set({ token });
  },
  clearToken: async () => {
    await AsyncStorage.removeItem('token');
    set({ token: null });
  },
}));
