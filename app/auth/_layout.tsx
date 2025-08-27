// app/auth/_layout.tsx
import { Inter_400Regular, Inter_600SemiBold, useFonts } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';

// ... dentro de tu componente principal


export default function AuthLayout() {
  const [fontsLoaded] = useFonts({
  Inter_400Regular,
  Inter_600SemiBold,
  // Puedes añadir más estilos si los necesitas
});

if (!fontsLoaded) {
  return null; // O un componente de carga mientras se cargan las fuentes
}
  return (
    // Este Stack Navigator agrupará tus pantallas de autenticación
    <Stack screenOptions={{ headerShown: false }}>
      {/* Expo Router automáticamente reconocerá login.tsx y register.tsx
          como rutas dentro de este layout (/auth/login y /auth/register) */}
    </Stack>
  );
}