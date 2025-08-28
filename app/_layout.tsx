// app/_layout.tsx
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay'; // 1. Importa el Spinner
import { View } from 'react-native'; // Importa View para el fondo

GoogleSignin.configure({
  webClientId: '479765324062-1867tpoi5aqr511g700nsiiok7c3277g.apps.googleusercontent.com',
});

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();

  // 2. Muestra el Spinner mientras isLoading es true
  if (isLoading) {
    // Usamos un View para darle un fondo oscuro mientras carga el spinner
    return (
      <View style={{ flex: 1, backgroundColor: '#1C1C1E' }}>
        <Spinner
          visible={true}
          textContent={'Cargando sesión...'}
          textStyle={{ color: '#FFF' }}
          color='#FFF'
        />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="auth" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}