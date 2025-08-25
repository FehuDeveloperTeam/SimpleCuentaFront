// app/index.tsx
import { Redirect } from 'expo-router';

export default function StartPage() {
  // Esta ruta es la primera que se carga en la aplicación.
  // Inmediatamente redirigimos al usuario a la pantalla de login.
  return <Redirect href="/auth/login" />;
}