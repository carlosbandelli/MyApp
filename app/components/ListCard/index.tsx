import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Text,
  Snackbar,
  ActivityIndicator,
} from 'react-native-paper';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { List } from './types';
import api from '@/src/api';
import { EditableInput, CardContainer, EditContainer } from './styles';
import { router } from 'expo-router';

interface ListCardProps {
  list: List;
  onDelete: (id: number) => void;
  onUpdate: (list: List) => void;
}

type RootStackParamList = {
  ListDetails: { list: List };
};

const ListCard: React.FC<ListCardProps> = ({ list, onDelete, onUpdate }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(list.name || '');
  const [editedTotalValue, setEditedTotalValue] = useState(
    list.totalValue.toString(),
  );
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEnter = async () => {
    console.log('=== Dados de Navegação ===');
    console.log('List ID:', list.id);
    console.log('Pathname:', '/screen/List/[id]');
    console.log('Params:', { id: list.id });
    console.log('Lista completa:', list);

    router.push({
      pathname: '/screen/List/[id]',
      params: { id: list.id },
    });
  };

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const handleCancel = (): void => {
    setEditedName(list.name || '');
    setEditedTotalValue(list.totalValue.toString());
    setIsEditing(false);
  };

  const handleSave = async (): Promise<void> => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      if (
        editedName === list.name &&
        parseFloat(editedTotalValue) === (list.totalValue || 0) // add this line
      ) {
        setSnackbarMessage('Nenhuma alteração foi feita');
        setSnackbarVisible(true);
        setIsEditing(false);
        setIsLoading(false);
        return;
      }

      const dataToSend = {
        name: editedName,
        totalValue: parseFloat(editedTotalValue),
        userId: list.userId,
      };

      console.log('URL da API:', `${api.defaults.baseURL}lists/${list.id}`);
      console.log('ID da lista:', list.id);
      console.log('Dados que serão enviados:', dataToSend);

      const response = await api.put<List>(`lists/${list.id}`, dataToSend);
      onUpdate(response.data);
      setIsEditing(false);
      setSnackbarMessage('Lista atualizada com sucesso');
      setSnackbarVisible(true);
      setIsLoading(false);
    } catch (error) {
      setSnackbarMessage('Erro ao salvar alterações');
      setSnackbarVisible(true);
      console.error('Erro ao editar lista:', error);
      setIsLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await api.delete(`lists/${list.id}`);
      onDelete(list.id);
      setSnackbarMessage('Lista deletada com sucesso');
      setSnackbarVisible(true);
      setIsLoading(false);
    } catch (error) {
      setSnackbarMessage('Erro ao deletar lista');
      setSnackbarVisible(true);
      console.error('Erro ao deletar lista:', error);
      setIsLoading(false);
    }
  };

  const fruitIcons = [
    'fruit-cherries',
    'fruit-watermelon',
    'food-apple',
  ] as const;
  type FruitIcon = (typeof fruitIcons)[number];

  const randomIcon: FruitIcon =
    fruitIcons[Math.floor(Math.random() * fruitIcons.length)];

  const LeftContent: React.FC<{ size: number }> = (props) => (
    <Avatar.Icon {...props} icon={randomIcon} />
  );

  return (
    <>
      <CardContainer>
        <Card mode="elevated" elevation={2}>
          {isEditing ? (
            <EditContainer>
              <EditableInput
                label="Nome da lista"
                value={editedName}
                onChangeText={setEditedName}
                mode="outlined"
              />
              <EditableInput
                label="Valor total"
                value={editedTotalValue}
                onChangeText={setEditedTotalValue}
                keyboardType="numeric"
                mode="outlined"
              />
            </EditContainer>
          ) : (
            <>
              <Card.Title
                title={list.name || 'Sem título'}
                subtitle={`Valor total da lista: R$ ${(list.totalValue || 0).toFixed(2)}`}
                left={LeftContent}
              />
              <Card.Content>
                <Text variant="bodyMedium">
                  Quantidade de produtos: {list.products?.length || 0}
                </Text>
              </Card.Content>
            </>
          )}
          <Card.Actions>
            {isEditing ? (
              <>
                <Button
                  onPress={handleSave}
                  mode="contained"
                  disabled={isLoading}
                >
                  Salvar
                </Button>
                <Button onPress={handleCancel} mode="outlined">
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button onPress={handleEnter} mode="contained">
                  Entrar
                </Button>
                <Button onPress={handleEdit} mode="outlined">
                  Editar
                </Button>
              </>
            )}
            <Button onPress={handleDelete} mode="outlined" textColor="red">
              Deletar
            </Button>
            {isEditing && !editedName && !editedTotalValue && (
              <ActivityIndicator animating={true} size="small" />
            )}
          </Card.Actions>
        </Card>
      </CardContainer>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

export default ListCard;
