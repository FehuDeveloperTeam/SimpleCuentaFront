// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Asegúrate de que tu instancia de axios esté configurada

// --- 1. Definir la forma de los datos del contexto ---
// Lo que el contexto proveerá
interface AuthData {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Para manejar el estado de carga inicial
  user: User | null; // Define una interfaz de usuario si la tienes
  signIn: (data: { token: string; user: User }) => Promise<void>;
  signOut: () => Promise<void>;
}

// Un ejemplo de la interfaz de usuario
interface User {
  id: string;
  name: string;
  email: string;
}

// --- 2. Crear el Contexto ---
// Se inicializa con un valor por defecto (undefined en este caso)
const AuthContext = createContext<AuthData | undefined>(undefined);

// --- 3. Crear el Proveedor (Provider) ---
// Este es el componente que envolverá tu aplicación
export const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Para el estado de carga inicial

  // Efecto para cargar el token desde AsyncStorage al iniciar la app
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('user_token');
        if (storedToken) {
          setToken(storedToken);
          // Opcional: Podrías querer validar el token con tu API aquí
          // y obtener los datos del usuario.
          // Por ahora, solo configuramos el header de axios.
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.error('Failed to load token from storage', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Función para iniciar sesión
  const signIn = async (data: { token: string; user: User }) => {
    setToken(data.token);
    setUser(data.user);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    await AsyncStorage.setItem('user_token', data.token);
    // Podrías querer guardar también los datos del usuario
    // await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
  };

  // Función para cerrar sesión
  const signOut = async () => {
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('user_token');
    // await AsyncStorage.removeItem('user_data');
  };
  
  // No renderizar nada hasta que se haya comprobado el token
  if (isLoading) {
    // Aquí podrías retornar una pantalla de carga (Splash Screen)
    return null; 
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 4. Crear un Hook personalizado ---
// Facilita el uso del contexto en otros componentes
export const useAuth = (): AuthData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};