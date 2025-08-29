// context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

// --- 1. Definición de Tipos ---

// Interface para el objeto de usuario que llega desde tu API de backend
interface BackendUser {
  _id: string;
  name: string;
  email: string;
}

// Interface para el objeto de usuario que usaremos dentro del frontend
interface User {
  id: string;
  name: string;
  email: string;
}

// Interface que define la forma de los datos que proveerá el contexto
interface AuthData {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Se añadió isLoading que faltaba
  user: User | null;
  // Se corrigió 'user' para que espere el tipo que viene del backend
  signIn: (data: { token: string; user: BackendUser }) => Promise<void>; 
  signOut: () => Promise<void>;
}

// --- 2. Creación del Contexto ---
const AuthContext = createContext<AuthData | undefined>(undefined);

// --- 3. Creación del Proveedor (Provider) ---
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para cargar los datos guardados al iniciar la app
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('user_token');
        const storedUser = await AsyncStorage.getItem('user_data'); // También cargamos el usuario
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser)); // Usamos los datos del usuario guardados
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      } catch (e) {
        console.error('Failed to load data from storage', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Función para iniciar sesión
  const signIn = async (data: { token: string; user: BackendUser }) => {
    // Mapeamos el usuario del backend al formato del frontend
    const formattedUser: User = {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
    };
    
    setToken(data.token);
    setUser(formattedUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    
    // Guardamos tanto el token como los datos del usuario formateado
    await AsyncStorage.setItem('user_token', data.token);
    await AsyncStorage.setItem('user_data', JSON.stringify(formattedUser));
  };

  // Función para cerrar sesión
  const signOut = async () => {
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_data'); // También borramos los datos del usuario
  };
  
  if (isLoading) {
    return null; // Muestra una pantalla en blanco (o un spinner) mientras carga
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 4. Creación del Hook Personalizado ---
export const useAuth = (): AuthData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
