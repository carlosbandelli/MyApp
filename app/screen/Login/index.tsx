import { Controller, useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Button,
  TextInput,
  Text,
  Snackbar,
  IconButton,
} from 'react-native-paper';
import { Container, Title } from '../styles';
import { useRouter } from 'expo-router';
import { loginUser } from '@/src/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/src/store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loginSchema = z.object({
  email: z.string().min(1, 'o usuario deve ser preenchido').trim(),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .trim(),
});

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { email, password, setEmail, setPassword, setIsLoading, setToken } =
    useAuthStore();

  const router = useRouter();

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPassword = await AsyncStorage.getItem('password');

        if (storedEmail) {
          setEmail(storedEmail);
          setValue('email', storedEmail);
        }

        if (storedPassword) {
          setPassword(storedPassword);
          setValue('password', storedPassword);
        }
      } catch (error) {
        console.error('Erro ao recuperar dados armazenados:', error);
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const formEmail = getValues('email');
    const formPassword = getValues('password');

    if (formEmail && formEmail !== email) {
      setEmail(formEmail);
    }

    if (formPassword && formPassword !== password) {
      setPassword(formPassword);
    }
  }, [getValues, email, password]);

  const handleLogin = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      const emailUpperCase = data.email.toUpperCase();

      const response = await loginUser(emailUpperCase, data.password);
      console.log('Resposta da API:', response);

      if (response.token) {
        await setToken(response.token);

        await AsyncStorage.setItem('email', emailUpperCase);
        await AsyncStorage.setItem('password', data.password);

        setSnackbarMessage('Login bem-sucedido');
        setSnackbarVisible(true);
        router.push('/screen/Home');
      } else {
        console.error('Erro: Token não encontrado na resposta da API');
        setSnackbarMessage('Falha ao autenticar.');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.log('Erro ao autenticar:', error);
      setSnackbarMessage('Falha ao autenticar.');
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <Container>
        <Title>Login</Title>

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="UserName"
              mode="outlined"
              style={{ marginBottom: 10, width: 300 }}
              value={value}
              onChangeText={(text) => {
                onChange(text);
                setEmail(text);
              }}
              error={!!errors.email}
            />
          )}
        />
        {errors.email?.message && <Text>{errors.email.message}</Text>}

        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Senha"
              mode="outlined"
              secureTextEntry={!showPassword}
              style={{ marginBottom: 10, width: 300 }}
              value={value}
              onChangeText={(text) => {
                onChange(text);
                setPassword(text);
              }}
              error={!!errors.password}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
          )}
        />
        {errors.password && typeof errors.password.message === 'string' && (
          <Text>{errors.password.message}</Text>
        )}

        <Button
          mode="elevated"
          onPress={handleSubmit(handleLogin)}
          style={{ marginTop: 20, width: 300 }}
          loading={isSubmitting}
          disabled={isSubmitting}
          icon="login"
          buttonColor="#968BAE"
        >
          Entrar
        </Button>
      </Container>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

export default Login;
