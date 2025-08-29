// app/(tabs)/profile.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // Importamos nuestro hook

export default function ProfileScreen() {
  // Obtenemos los datos del usuario y la función signOut del contexto
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar tu sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Sí, cerrar sesión", 
          onPress: () => signOut() 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      {/* Mostramos un saludo con el nombre del usuario guardado en el contexto */}
      <Text style={styles.welcomeText}>¡Hola, {user?.name || 'Usuario'}!</Text>
      <Text style={styles.emailText}>{user?.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 22,
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#e74c3c', // Un color rojo para la acción de cerrar sesión
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});