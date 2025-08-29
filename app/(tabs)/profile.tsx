// app/(tabs)/profile.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react'; // Importa useState
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ConfirmModal } from '../../components/ui/ConfirmModal'; // 1. Importa el modal
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  // 2. Estado para controlar la visibilidad del modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 3. Esta función ahora solo abre el modal
  const handleLogoutPress = () => {
    setIsModalVisible(true);
  };

  // 4. Esta es la lógica que se ejecutará si el usuario confirma
  const confirmLogout = async () => {
    setIsModalVisible(false); // Cierra el modal primero
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Mi Perfil</Text>
        <Text style={styles.welcomeText}>¡Hola, {user?.name || 'Usuario'}!</Text>
        <Text style={styles.emailText}>{user?.email}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Renderiza el modal y pásale las propiedades */}
      <ConfirmModal
        visible={isModalVisible}
        title="Cerrar Sesión"
        message="¿Estás seguro de que quieres cerrar tu sesión?"
        onCancel={() => setIsModalVisible(false)}
        onConfirm={confirmLogout}
        confirmText="Sí, cerrar"
      />
    </>
  );
}

// ... (tus estilos permanecen igual)
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
    backgroundColor: '#e74c3c',
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
