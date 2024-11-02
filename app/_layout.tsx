// app/_layout.tsx
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import {
  Provider as PaperProvider,
  DefaultTheme,
  MD3DarkTheme,
  Button as PaperButton,
  useTheme,
} from 'react-native-paper';
import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const theme = useTheme();
  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplashScreen();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name="screen/Home/index"
          options={{ title: 'Home', headerShown: false }}
        />
        <Stack.Screen
          name="screen/Login/index"
          options={{ title: 'Login', headerShown: false }}
        />
        <Stack.Screen
          name="screen/Register/index"
          options={{ title: 'Register', headerShown: false }}
        />
        <Stack.Screen
          name="screen/List/[id]"
          options={{
            title: 'Detalhes da Lista',
            headerShown: false,
          }}
        />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
