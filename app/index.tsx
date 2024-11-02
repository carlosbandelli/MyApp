import React, { useState } from 'react';
import { Button, View, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Provider as PaperProvider,
  DefaultTheme,
  MD3DarkTheme,
  Button as PaperButton,
  useTheme,
} from 'react-native-paper';
import Login from './screen/Login';
import Register from './screen/Register';
import { Container } from './screen/styles';
import { useAuthStore } from '@/src/store/authStore';

export default function Page() {
  const [screen, setScreen] = useState<'login' | 'register'>('login');
  const theme = useTheme();
  const { isLoading } = useAuthStore();

  return (
    <SafeAreaProvider>
      <PaperProvider theme={{ colors: { background: theme.colors.primary } }}>
        <Container>
          {screen === 'login' ? <Login /> : <Register />}
          <View style={{ marginBottom: 200 }}>
            <PaperButton
              mode="elevated"
              disabled={isLoading}
              icon={screen === 'login' ? 'account-plus' : 'login'} // Adiciona o ícone correto
              loading={isLoading}
              onPress={() =>
                setScreen(screen === 'login' ? 'register' : 'login')
              }
              buttonColor="#968BAE"
            >
              {screen === 'login' ? 'Ir para Registro' : 'Ir para Login'}
            </PaperButton>
          </View>
        </Container>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
