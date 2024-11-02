import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
  AnimatedFAB,
  Snackbar,
  TextInput,
  Card,
  Button,
} from 'react-native-paper';
import api from '@/src/api';
import {
  ButtonContainer,
  Container,
  FabContainer,
  FormContainer,
  InputContainer,
} from './styles';

// Atualizada a interface para incluir o callback de atualização
interface FabProductProps {
  listId: string | string[];
  userId: any;
  onProductAdded?: () => void; // Nova prop para callback de atualização
}

// Função para formatar o valor como moeda em reais, começando com os centavos
export const formatBrlCoin = (value: string): string => {
  const numericValue = value.replace(/\D/g, ''); // Remove qualquer caractere que não seja numérico
  const centavos = parseInt(numericValue || '0', 10); // Converte para número

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100); // Divide por 100 para formatar como reais
};

const FabProduct: React.FC<FabProductProps> = ({
  listId,
  userId,
  onProductAdded,
}) => {
  console.log('Valor de listId:', listId, 'Tipo:', typeof listId);
  console.log('Valor de userId:', userId, 'Tipo:', typeof userId);

  const [isExtended, setIsExtended] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [fabPosition] = useState(16);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.post('products/', {
        name: name || 'Sem nome',
        price: parseFloat(price.replace(/[^0-9]/g, '')) / 100 || 0.0, // Converte para número em reais
        quantity: parseInt(quantity) || 1,
        listId,
        userId,
      });
      setSnackbarMessage('Produto adicionado com sucesso!');
      setShowForm(false);
      clearForm();

      // Chama o callback de atualização após adicionar o produto com sucesso
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
    setQuantity('');
  };

  const handleCancel = () => {
    setShowForm(false);
    clearForm();
  };

  const handlePriceChange = (value: string) => {
    const formattedValue = formatBrlCoin(value);
    setPrice(formattedValue); // Atualiza o estado com o valor formatado
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
                  label="Preço"
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
                <TextInput
                  label="Qtd"
                  value={quantity}
                  keyboardType="numeric"
                  onChangeText={setQuantity}
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
        <AnimatedFAB
          icon="plus"
          label=""
          extended={isExtended}
          onPress={() => setShowForm(!showForm)}
          visible
          iconMode="static"
          animateFrom="left"
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
