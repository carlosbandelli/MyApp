import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Snackbar, TextInput, Card, Button, FAB } from 'react-native-paper';
import { AxiosInstance } from 'axios';
import {
  Container,
  InputContainer,
  ButtonContainer,
  FormContainer,
  FabContainer,
} from './styles';
import { useAuthStore } from '@/src/store/authStore';

interface FabAnimatedProps {
  apiInstance: AxiosInstance;
  endpoint: string;
  successMessage: string;
  errorMessage: string;
}

export const formatBrlCoin = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100); // Divide por 100 para exibir em reais com centavos
};

const FabAnimated: React.FC<FabAnimatedProps> = ({
  apiInstance,
  endpoint,
  successMessage,
  errorMessage,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fabPosition] = useState(16); // posição padrão do FAB
  const { setIsRefreshing } = useAuthStore((state) => state);
  const handleSave = async () => {
    setIsLoading(true);

    try {
      const response = await apiInstance.post(endpoint, {
        name: (name || 'Sem nome').toUpperCase(),
        totalValue: parseFloat(totalValue.replace(/[^0-9]/g, '')) / 100 || 0.0,
      });
      setSnackbarMessage(successMessage);

      // Acionar o refresh ao concluir com sucesso
      setIsRefreshing(true);

      setShowForm(false);
    } catch (error) {
      setSnackbarMessage(errorMessage);
    } finally {
      setIsLoading(false);
      setSnackbarVisible(true);
    }
  };

  const handleTotalValueChange = (value: string) => {
    // Remove qualquer caractere que não seja numérico
    let numericValue = value.replace(/\D/g, '');

    // Converte para número e formata como moeda em centavos
    const centavos = parseInt(numericValue || '0', 10);

    // Formata para BRL e define o valor no estado
    const formattedValue = formatBrlCoin(centavos);
    setTotalValue(formattedValue);
  };

  const handleCancel = () => {
    setShowForm(false);
    setName('');
    setTotalValue('');
  };

  return (
    <Container>
      {showForm && (
        <FormContainer fabPosition={fabPosition}>
          <Card
            elevation={5}
            style={{
              backgroundColor: '#7048D1',
            }}
          >
            <Card.Content>
              <InputContainer
                style={{
                  backgroundColor: '#7048D1',
                  borderRadius: 8,
                }}
              >
                <TextInput
                  label="Nome da lista"
                  value={name}
                  onChangeText={setName}
                  mode="outlined"
                  style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#968BAE',
                  }}
                />
                <TextInput
                  label="R$ 0,00"
                  value={totalValue}
                  keyboardType="numeric"
                  onChangeText={handleTotalValueChange}
                  mode="outlined"
                  style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#968BAE',
                  }}
                />
                <ButtonContainer>
                  <Button
                    mode="contained"
                    onPress={handleSave}
                    disabled={isLoading}
                    icon="check"
                    style={{
                      marginRight: 10,
                      backgroundColor: '#968BAE',
                      borderRadius: 8,
                    }}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      'Salvar'
                    )}
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    icon="close"
                    style={{
                      backgroundColor: '#968BAE',
                      borderRadius: 8,
                    }}
                  >
                    Cancelar
                  </Button>
                </ButtonContainer>
              </InputContainer>
            </Card.Content>
          </Card>
        </FormContainer>
      )}

      <FabContainer>
        <FAB
          icon="plus"
          onPress={() => setShowForm(!showForm)}
          size="medium"
          variant="primary"
          label="Nova lista"
        />
      </FabContainer>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </Container>
  );
};

export default FabAnimated;
