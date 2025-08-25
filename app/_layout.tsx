// app/_layout.tsx
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Stack } from 'expo-router';
import React from 'react';

GoogleSignin.configure({
  webClientId: '479765324062-1867tpoi5aqr511g700nsiiok7c3277g.apps.googleusercontent.com',
});
// Importa el contexto de autenticación aquí más adelante

export default function RootLayout() {
  // TODO: Aquí iría la lógica real para verificar si el usuario está autenticado
  const isAuthenticated = false; // Por ahora, forzamos a que no esté autenticado para mostrar el login

  return (
    <Stack>
      {/* Si el usuario NO está autenticado, redirige a la ruta de autenticación */}
      {!isAuthenticated ? (
        <Stack.Screen name="auth" options={{ headerShown: false }} /> // Ruta /app/auth/_layout.tsx
      ) : (
        // Si el usuario SÍ está autenticado, muestra las pestañas principales de la app
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> // Ruta /app/(tabs)/_layout.tsx
      )}
      {/* Opcional: una pantalla para "Not Found" si la tienes */}
      {/* <Stack.Screen name="+not-found" /> */}
    </Stack>
  );
};