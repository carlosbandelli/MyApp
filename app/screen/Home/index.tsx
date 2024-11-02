import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Provider as PaperProvider,
  DefaultTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import { useColorScheme } from 'react-native';
// Certifique-se de que o caminho está correto
import { Container } from '../styles';
import ListContainer from '@/app/components/listContainer';
import { useAuthStore } from '@/src/store/authStore';
import FabAnimated from '@/app/components/animatedFabComponent';
import api from '@/src/api';
// Certifique-se de que o caminho está correto

const Home = () => {
  const { token, loadTokenFromStorage, isLoading } = useAuthStore();
  const scheme = useColorScheme();

  useEffect(() => {
    // Carregar o token assim que a Home for montada
    loadTokenFromStorage();
  }, []);

  useEffect(() => {
    if (!token && !isLoading) {
      Alert.alert('Erro', 'Usuário não autenticado.');
    }
  }, [token, isLoading]);

  if (isLoading) {
    // Mostrar loading enquanto recupera o token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!token) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Usuário não autenticado. Por favor, faça login.</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={scheme === 'dark' ? MD3DarkTheme : DefaultTheme}>
        <Container>
          <ListContainer />
          <FabAnimated
            apiInstance={api}
            endpoint={'lists/'}
            successMessage={'Nova lista criada!'}
            errorMessage={'Lista não criada'}
          />
        </Container>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default Home;
