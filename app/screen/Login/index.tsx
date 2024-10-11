// app/screen/Login/index.tsx
import { loginUser } from '@/src/auth/auth';
import { useAuthStore } from '@/src/store/authStore';
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container, Title, StyledInput } from '../styles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogin = async () => {
    try {
      const { token } = await loginUser(email, password);
      setToken(token);
      Alert.alert('Login bem-sucedido');
    } catch (error) {
      Alert.alert('Erro no login', 'Falha ao autenticar.');
    }
  };

  return (
    <SafeAreaView>
      <Container>
        <Title>Login</Title>
        <StyledInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <StyledInput
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Entrar" onPress={handleLogin} />
      </Container>
    </SafeAreaView>
  );
};

export default Login;
