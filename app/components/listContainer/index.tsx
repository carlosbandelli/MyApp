import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/src/api';
import { useAuthStore } from '@/src/store/authStore';
import ListCard from '../ListCard';
import FabAnimated from '../animatedFabComponent';

interface List {
  id: number;
  name: string | null;
  products: Array<{ id: number; name: string }>;
  totalValue: number;
  userId: number;
}

interface ScrollInfo {
  isScrollEnabled: boolean;
  hasReachedThreshold: boolean;
}

const ListContainer = () => {
  const { loadTokenFromStorage, token, isRefreshing, setIsRefreshing } =
    useAuthStore();
  const [visible, setVisible] = useState(true);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    isScrollEnabled: true,
    hasReachedThreshold: false,
  });

  const fetchLists = async (): Promise<List[]> => {
    console.log('=== Iniciando fetchLists ===');
    await loadTokenFromStorage();

    console.log('2. Token atual:', token);
    console.log('3. Headers atuais da API:', api.defaults.headers);

    const response = await api.get<List[]>('lists/', {
      transformRequest: [
        (data, headers) => {
          console.log('5. Headers enviados na requisição:', headers);
          return data;
        },
      ],
    });

    console.log('6. Status da resposta:', response.status);
    console.log('7. Headers da resposta:', response.headers);
    console.log('8. Dados recebidos:', response.data);
    console.log('=== Fim fetchLists ===');

    return response.data;
  };

  const {
    data: lists = [],
    isLoading: isLoadingQuery,
    error,
    isError,
    refetch,
  } = useQuery<List[], Error>({
    queryKey: ['lists', token],
    queryFn: fetchLists,
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const handleDelete = async (deletedId: number): Promise<void> => {
    queryClient.setQueryData<List[]>(['lists', token], (oldData) =>
      oldData ? oldData.filter((list) => list.id !== deletedId) : [],
    );
    await refetch();
  };

  const handleUpdate = async (updatedList: List): Promise<void> => {
    queryClient.setQueryData<List[]>(['lists', token], (oldData) =>
      oldData
        ? oldData.map((list) =>
            list.id === updatedList.id ? updatedList : list,
          )
        : [],
    );
    await refetch();
  };

  useEffect(() => {
    if (isRefreshing) {
      handleRefresh();
    }
  }, [isRefreshing]);

  const handleRefresh = async (): Promise<void> => {
    setIsLoading(true);
    await refetch();
    setIsLoading(false);
    setIsRefreshing(false); // Reseta o refreshing após o refresh
  };
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const scrollPercentage =
        (contentOffset.y + layoutMeasurement.height) / contentSize.height;

      if (scrollPercentage >= 0.8 && !scrollInfo.hasReachedThreshold) {
        setScrollInfo((prev) => ({
          ...prev,
          hasReachedThreshold: true,
          isScrollEnabled: true,
        }));
        console.log('Atingiu 80% do scroll');
        // Aqui você pode adicionar qualquer lógica adicional que queira executar ao atingir 80%
      }
    },
    [scrollInfo.hasReachedThreshold],
  );

  if (isLoadingQuery) {
    console.log('Componente em estado de loading');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (isError) {
    console.log('Componente em estado de erro:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Erro ao carregar as listas: {error.message}</Text>
      </View>
    );
  }

  console.log('Renderizando listas:', lists?.length, 'itens');

  return (
    <View style={{ flexGrow: 1, flexDirection: 'column', padding: 10 }}>
      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <ListCard
            key={item.id}
            list={item}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 10 }}
        style={{ flex: 1 }}
        refreshing={isLoading}
        onRefresh={handleRefresh}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        scrollEnabled={scrollInfo.isScrollEnabled}
      />
    </View>
  );
};

export default ListContainer;
