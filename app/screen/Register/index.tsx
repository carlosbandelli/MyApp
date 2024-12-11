import { registerUser } from '@/src/auth/auth';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, TextInput, Text, Snackbar } from 'react-native-paper';
import { Container, Title } from '../styles';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/src/store/authStore';
import { useRouter } from 'expo-router';

const schema = z.object({
  username: z
    .string()
    .min(3, { message: 'O nome de usuário deve ter no mínimo 3 caracteres' })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'O nome de usuário deve conter apenas letras e espaços',
    })
    .trim(),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
    .trim(),
});

type FormData = z.infer<typeof schema>;

const Register = () => {
  const { setIsLoading, isLoading } = useAuthStore();
  const router = useRouter();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleRegister = async (data: FormData) => {
    setIsLoading(true);
    const { username, password } = data;

    // Converte o username para maiúsculas antes de enviá-lo ao backend
    const usernameUpperCase = username.toUpperCase();

    try {
      await registerUser(usernameUpperCase, password);
      setSnackbarMessage('Registro bem-sucedido!');
      setSnackbarVisible(true);
      router.push('/screen/Home');
    } catch (error) {
      setSnackbarMessage('Erro no registro. Tente novamente.');
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <Container>
        <Title>Registrar</Title>

        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Username"
              mode="outlined"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              style={{ marginBottom: 10, width: 300 }}
              error={!!errors.username}
            />
          )}
        />
        {errors.username && (
          <Text style={{ color: 'red' }}>{errors.username.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Senha"
              mode="outlined"
              secureTextEntry={!showPassword}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              style={{ marginBottom: 10, width: 300 }}
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
        {errors.password && (
          <Text style={{ color: '#FF5449' }}>{errors.password.message}</Text>
        )}

        <Button
          mode="elevated"
          onPress={handleSubmit(handleRegister)}
          style={{ marginTop: 20, width: 300 }}
          loading={isLoading}
          disabled={isLoading}
          icon="account-plus"
          buttonColor="#968BAE"
        >
          {isLoading ? 'Registrando...' : 'Registrar'}
        </Button>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={Snackbar.DURATION_SHORT}
          action={{
            label: 'Fechar',
            onPress: () => setSnackbarVisible(false),
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Container>
    </SafeAreaView>
  );
};

export default Register;
