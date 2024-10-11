// app/screen/Register/index.tsx
import { registerUser } from '@/src/auth/auth';
import React, { useState } from 'react';
import { Button, Alert } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Container, StyledInput, Title } from '../styles';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await registerUser(email, password);
      Alert.alert('Registro bem-sucedido');
    } catch (error) {
      Alert.alert('Erro no registro', 'Falha ao registrar.');
    }
  };

  return (
    <SafeAreaView>
      <Container>
        <Title>Registrar</Title>
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
        <Button title="Registrar" onPress={handleRegister} />
      </Container>
    </SafeAreaView>
  );
};

export default Register;
