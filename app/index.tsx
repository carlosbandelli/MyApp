import React, { useState } from 'react';
import { Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Login from './screen/Login';
import Register from './screen/Register';
import { Container } from './screen/styles';

export default function Page() {
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  return (
    <SafeAreaProvider>
      <Container>
        {screen === 'login' ? <Login /> : <Register />}
        <Button
          title={screen === 'login' ? 'Ir para Registro' : 'Ir para Login'}
          onPress={() => setScreen(screen === 'login' ? 'register' : 'login')}
        />
      </Container>
    </SafeAreaProvider>
  );
}
