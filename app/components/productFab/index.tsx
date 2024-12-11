import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
  Snackbar,
  TextInput,
  Card,
  Button,
  FAB,
  IconButton,
  Text,
} from 'react-native-paper';
import api from '@/src/api';
import {
  ButtonContainer,
  Container,
  FabContainer,
  FormContainer,
  InputContainer,
} from './styles';

interface FabProductProps {
  listId: string | string[];
  userId: any;
  onProductAdded?: () => void;
}

export const formatBrlCoin = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');
  const centavos = parseInt(numericValue || '0', 10);

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100);
};

const FabProduct: React.FC<FabProductProps> = ({
  listId,
  userId,
  onProductAdded,
}) => {
  console.log('Valor de listId:', listId, 'Tipo:', typeof listId);
  console.log('Valor de userId:', userId, 'Tipo:', typeof userId);

  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('0');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fabPosition] = useState(16);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.post('products/', {
        name: (name || 'Sem nome').toUpperCase(),
        price: parseFloat(price.replace(/[^0-9]/g, '')) / 100 || 0.0,
        quantity: parseInt(quantity) || 0,
        listId,
        userId,
      });
      setSnackbarMessage('Produto adicionado com sucesso!');
      setShowForm(false);
      clearForm();

      if (onProductAdded) {
        onProductAdded();
      }
    } catch (error) {
      setSnackbarMessage('Erro ao adicionar produto.');
    } finally {
      setIsLoading(false);
      setSnackbarVisible(true);
    }
  };

  const clearForm = () => {
    setName('');
    setPrice('');
    setQuantity('0');
  };

  const handleCancel = () => {
    setShowForm(false);
    clearForm();
  };

  const handlePriceChange = (value: string) => {
    const formattedValue = formatBrlCoin(value);
    setPrice(formattedValue);
  };

  const handleIncrement = () => {
    const currentQuantity = parseInt(quantity);
    setQuantity((currentQuantity + 1).toString());
  };

  const handleDecrement = () => {
    const currentQuantity = parseInt(quantity);
    if (currentQuantity > 0) {
      setQuantity((currentQuantity - 1).toString());
    }
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
                  label="Nome do produto"
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
                  label="R$ 0.00"
                  value={price}
                  keyboardType="numeric"
                  onChangeText={handlePriceChange}
                  mode="outlined"
                  style={{
                    width: '100%',
                    paddingHorizontal: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#968BAE',
                  }}
                />

                {/* Novo componente de quantidade com IconButtons */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#968BAE',
                    borderRadius: 8,
                    marginVertical: 8,
                    padding: 8,
                    width: '100%',
                  }}
                >
                  <IconButton
                    icon="minus"
                    mode="contained"
                    onPress={handleDecrement}
                    disabled={parseInt(quantity) <= 0}
                    style={{
                      backgroundColor:
                        parseInt(quantity) <= 0 ? '#cccccc' : '#7048D1',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      marginHorizontal: 20,
                      color: '#000000',
                    }}
                  >
                    {quantity}
                  </Text>
                  <IconButton
                    icon="plus"
                    mode="contained"
                    onPress={handleIncrement}
                    style={{
                      backgroundColor: '#7048D1',
                    }}
                  />
                </View>

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
          label="Nova Produto"
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

export default FabProduct;
