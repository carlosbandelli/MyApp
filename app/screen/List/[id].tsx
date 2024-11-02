import React, { useState, useEffect } from 'react';
import {
  Surface,
  DataTable,
  Text,
  Appbar,
  ActivityIndicator,
  Checkbox,
  Button,
  TextInput,
  Icon,
  Snackbar,
  IconButton,
} from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/src/store/authStore';
import api from '@/src/api';
import { ScrollView, View, Dimensions } from 'react-native';
import FabButton from '@/app/components/productFab';
import FabAnimated from '@/app/components/animatedFabComponent';
import FabProduct from '@/app/components/productFab';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  listId: number;
}

interface ListDetails {
  name: string;
  totalValue: number;
  userId: number;
  products: Product[];
}

const ListDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { loadTokenFromStorage, token } = useAuthStore();

  const [selectedProducts, setSelectedProducts] = useState<{
    [key: number]: boolean;
  }>({});
  const [loading, setLoading] = useState<number | null>(null);
  const [editableProduct, setEditableProduct] = useState<{
    [key: number]: boolean;
  }>({});
  const [editedProducts, setEditedProducts] = useState<{
    [key: number]: {
      name?: string;
      price?: string;
      quantity?: string;
    };
  }>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchListDetails = async (): Promise<ListDetails> => {
    await loadTokenFromStorage();
    const response = await api.get<ListDetails>(`lists/list/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Body da Resposta:', response.data);
    console.log('Headers da Resposta:', response.headers);
    return response.data;
  };

  const showSnackbar = (message: string, processing: boolean = false) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
    setIsProcessing(processing);
  };

  const updateProduct = async (productId: number) => {
    const editedProduct = editedProducts[productId];
    if (!editedProduct) return;

    setLoading(productId);
    showSnackbar('Aguardando resposta do servidor...', true);

    try {
      const updatedData = {
        name: editedProduct.name?.trim() || '',
        price: editedProduct.price ? parseFloat(editedProduct.price) : 0,
        quantity: editedProduct.quantity
          ? parseFloat(editedProduct.quantity)
          : 0,
      };

      await api.put(`products/${productId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSnackbar('Produto editado com sucesso!', false);
      refetch();
    } catch (error) {
      showSnackbar('Erro ao atualizar produto. Tente novamente.', false);
      console.error('Error updating product:', error);
    } finally {
      setLoading(null);
    }
  };

  const {
    data: listDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<ListDetails, Error>({
    queryKey: ['list', id],
    queryFn: fetchListDetails,
    enabled: !!token && !!id,
  });

  const handleCheckboxToggle = (productId: number) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleEditToggle = (product: Product) => {
    setEditableProduct((prev) => {
      const newState = { ...prev };
      newState[product.id] = !prev[product.id];
      return newState;
    });

    if (!editableProduct[product.id]) {
      setEditedProducts((prev) => ({
        ...prev,
        [product.id]: {
          name: product.name,
          price: product.price.toString(),
          quantity: product.quantity.toString(),
        },
      }));
    }
  };

  const handleInputChange = (
    field: 'name' | 'price' | 'quantity',
    value: string,
    productId: number,
  ) => {
    setEditedProducts((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleDeleteProduct = async (productId: number) => {
    setLoading(productId);
    showSnackbar('Aguardando resposta do servidor...', true);

    try {
      await api.delete(`products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSnackbar('Produto deletado com sucesso!', false);
      refetch();
    } catch (error) {
      showSnackbar('Erro ao deletar produto. Tente novamente.', false);
      console.error('Error deleting product:', error);
    } finally {
      setLoading(null);
    }
  };

  const screenHeight = Dimensions.get('window').height;
  const tableHeight = screenHeight * 0.7;

  if (isLoading) {
    return (
      <Surface
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge">Carregando...</Text>
      </Surface>
    );
  }

  if (isError) {
    return (
      <Surface
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text variant="bodyLarge">
          Erro ao carregar detalhes: {error.message}
        </Text>
      </Surface>
    );
  }

  return (
    <Surface
      style={{
        flex: 1,
        backgroundColor: '#7048d1',
        // Versão com alpha
      }}
    >
      <StatusBar style="dark" />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={listDetails?.name} />
      </Appbar.Header>
      <Surface style={{ padding: 8, flex: 1, backgroundColor: '#7048d1' }}>
        <Text variant="headlineMedium" style={{ marginBottom: 8 }}>
          Detalhes da Lista
        </Text>
        <Text variant="titleMedium" style={{ marginBottom: 16 }}>
          Valor Total: R$ {listDetails?.totalValue.toFixed(2)}
        </Text>

        <View style={{ height: tableHeight }}>
          <ScrollView style={{ height: '100%' }}>
            <ScrollView horizontal>
              <DataTable
                style={{
                  elevation: 2,
                  borderRadius: 8,
                  backgroundColor: '#968BAE',
                  minWidth: '100%',
                }}
              >
                <DataTable.Header
                  style={{ backgroundColor: '#968BAE', borderRadius: 8 }}
                >
                  <DataTable.Title
                    style={{
                      width: 70,
                      paddingLeft: 8,
                      backgroundColor: '#968BAE',
                    }}
                  >
                    <Text>Select</Text>
                  </DataTable.Title>
                  <DataTable.Title
                    style={{
                      flex: 2,
                      minWidth: 50,
                      backgroundColor: '#968BAE',
                    }}
                  >
                    <Text>Nome</Text>
                  </DataTable.Title>
                  <DataTable.Title
                    numeric
                    style={{
                      width: 100,
                      paddingHorizontal: 20,
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#968BAE',
                    }}
                  >
                    <Text>Qtd</Text>
                  </DataTable.Title>
                  <DataTable.Title
                    numeric
                    style={{
                      width: 100,
                      paddingHorizontal: 20,
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#968BAE',
                    }}
                  >
                    <Text>Preço</Text>
                  </DataTable.Title>
                  <DataTable.Title
                    style={{
                      width: 100,
                      paddingHorizontal: 20,
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#968BAE',
                    }}
                  >
                    <Text style={{ textAlign: 'center' }}>Editar</Text>
                  </DataTable.Title>
                  <DataTable.Title
                    style={{
                      width: 100,
                      paddingHorizontal: 20,
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#968BAE',
                    }}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                      }}
                    >
                      Deletar
                    </Text>
                  </DataTable.Title>
                </DataTable.Header>

                {listDetails?.products.map((product) => {
                  const isSelected = selectedProducts[product.id] || false;
                  const isEditable = editableProduct[product.id] || false;
                  const editedProduct = editedProducts[product.id] || {};

                  return (
                    <DataTable.Row
                      key={product.id}
                      style={{ backgroundColor: '#968BAE', borderRadius: 8 }}
                    >
                      <DataTable.Cell
                        style={{
                          width: 70,
                          paddingLeft: 8,
                          backgroundColor: '#968BAE',
                        }}
                      >
                        <Checkbox
                          status={isSelected ? 'checked' : 'unchecked'}
                          onPress={() => handleCheckboxToggle(product.id)}
                        />
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          flex: 2,
                          minWidth: 80,
                          paddingHorizontal: 20,
                          display: 'flex',
                          justifyContent: 'center',
                          backgroundColor: '#968BAE',
                        }}
                      >
                        {isEditable ? (
                          <TextInput
                            mode="outlined"
                            style={{ flex: 1 }}
                            value={editedProduct.name ?? ''}
                            onChangeText={(value) =>
                              handleInputChange('name', value, product.id)
                            }
                          />
                        ) : (
                          <Text
                            style={{
                              textDecorationLine: isSelected
                                ? 'line-through'
                                : 'none',
                              opacity: isSelected ? 0.5 : 1,
                            }}
                          >
                            {product.name}
                          </Text>
                        )}
                      </DataTable.Cell>
                      <DataTable.Cell
                        numeric
                        style={{
                          width: 100,
                          paddingHorizontal: 20,
                          display: 'flex',
                          justifyContent: 'center',
                          backgroundColor: '#968BAE',
                        }}
                      >
                        {isEditable ? (
                          <TextInput
                            mode="outlined"
                            keyboardType="numeric"
                            style={{ width: 80 }}
                            value={editedProduct.quantity ?? ''}
                            onChangeText={(value) =>
                              handleInputChange('quantity', value, product.id)
                            }
                          />
                        ) : (
                          <Text style={{ opacity: isSelected ? 0.5 : 1 }}>
                            {product.quantity}
                          </Text>
                        )}
                      </DataTable.Cell>
                      <DataTable.Cell
                        numeric
                        style={{
                          width: 100,
                          paddingHorizontal: 20,
                          display: 'flex',
                          justifyContent: 'center',
                          backgroundColor: '#968BAE',
                        }}
                      >
                        {isEditable ? (
                          <TextInput
                            mode="outlined"
                            keyboardType="numeric"
                            style={{ width: 80 }}
                            value={editedProduct.price ?? ''}
                            onChangeText={(value) =>
                              handleInputChange('price', value, product.id)
                            }
                          />
                        ) : (
                          <Text style={{ opacity: isSelected ? 0.5 : 1 }}>
                            R$ {product.price.toFixed(2)}
                          </Text>
                        )}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          width: 100,
                          paddingHorizontal: 20,
                          display: 'flex',
                          justifyContent: 'center',
                          backgroundColor: '#968BAE',
                        }}
                      >
                        {isEditable ? (
                          <IconButton
                            mode="contained"
                            icon="content-save"
                            size={20}
                            onPress={() => {
                              updateProduct(product.id);
                              handleEditToggle(product);
                            }}
                            loading={loading === product.id}
                            disabled={loading === product.id}
                            style={{ marginHorizontal: 4 }}
                          />
                        ) : (
                          <IconButton
                            mode="contained-tonal"
                            icon="pencil"
                            size={20}
                            onPress={() => handleEditToggle(product)}
                            disabled={loading === product.id}
                            style={{ marginHorizontal: 4 }}
                          />
                        )}
                      </DataTable.Cell>
                      <DataTable.Cell
                        style={{
                          width: 100,
                          paddingHorizontal: 20,
                          display: 'flex',
                          justifyContent: 'center',
                          backgroundColor: '#968BAE',
                        }}
                      >
                        <IconButton
                          mode="contained-tonal"
                          icon="delete"
                          size={20}
                          onPress={() => handleDeleteProduct(product.id)}
                          disabled={loading === product.id}
                          style={{
                            marginHorizontal: 4,
                          }}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                })}
              </DataTable>
            </ScrollView>
          </ScrollView>
        </View>
      </Surface>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {isProcessing && (
            <ActivityIndicator
              size={20}
              color="#ffffff"
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={{ color: 'white' }}>{snackbarMessage}</Text>
        </View>
      </Snackbar>
      <FabProduct
        listId={id}
        userId={listDetails?.userId}
        onProductAdded={() => {
          refetch();
        }}
      />
    </Surface>
  );
};

export default ListDetailsScreen;
