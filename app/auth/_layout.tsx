// app/auth/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    // Este Stack Navigator agrupará tus pantallas de autenticación
    <Stack screenOptions={{ headerShown: false }}>
      {/* Expo Router automáticamente reconocerá login.tsx y register.tsx
          como rutas dentro de este layout (/auth/login y /auth/register) */}
    </Stack>
  );
}