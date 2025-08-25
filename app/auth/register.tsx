// app/auth/register.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../lib/api'; // <--- ¡RUTA AJUSTADA!

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', { username, email, password });
      Alert.alert('¡Registro Exitoso!', response.data.message || 'Tu cuenta ha sido creada. ¡Ahora puedes iniciar sesión!');
      router.replace('/auth/login'); // Redirige al login después del registro exitoso
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: any }; message?: string };
        console.error('Error al registrar usuario:', err.response ? err.response.data : err.message);
        Alert.alert(
          'Error al registrar',
          err.response?.data?.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.'
        );
      } else {
        console.error('Error al registrar usuario:', String(error));
        Alert.alert(
          'Error al registrar',
          'Ocurrió un error inesperado. Inténtalo de nuevo.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        placeholderTextColor={'#888'}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={'#888'}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={'#888'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={loading ? "Registrando..." : "Registrarse"}
        onPress={handleRegister}
        disabled={loading}
        color="#28a745"
      />

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => router.replace('/auth/login')}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e9f7ef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    
    
  },
  linksContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  linkText: {
    color: '#28a745',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});