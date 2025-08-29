// app/auth/register.tsx
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      
      // Inicia sesión automáticamente después del registro exitoso
      await signIn({ token: response.data.token, user: response.data.user });

      router.replace('/(tabs)');
      
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error('Error en el registro:', err.response ? err.response.data : err.message);
      Alert.alert(
        'Error en el registro',
        err.response?.data?.message || 'No se pudo completar el registro. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../assets/imagesApp/background0.jpg')} style={styles.backgroundImage}>
      <LinearGradient colors={['transparent', 'transparent']} style={styles.gradientBackground}>
        <View style={styles.container}>
          <BlurView intensity={20} tint="light" style={styles.formCardGeneral}>
            <View style={styles.formCard}>
              <Text style={styles.title}>Crea tu cuenta</Text>
              
              <TextInput
                style={styles.buttonInput}
                placeholder="Nombre completo"
                placeholderTextColor={'#888'}
                textAlign='right'
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.buttonInput}
                placeholder="Correo electrónico"
                placeholderTextColor={'#888'}
                textAlign='right'
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Contraseña"
                  placeholderTextColor={'#888'}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="gray" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.buttonInput}
                placeholder="Confirmar contraseña"
                placeholderTextColor={'#888'}
                textAlign='right'
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Registrando..." : "Registrarse"}
                </Text>
              </TouchableOpacity>

              <View style={styles.linksContainer}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.linkText}>¿Ya tienes una cuenta?</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace('/auth/login')}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>
                      Inicia Sesión
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BlurView>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

// Estilos (son una copia de login.tsx para mantener la consistencia)
const styles = StyleSheet.create({
  backgroundImage: {
    color: '#000',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderColor: "#A09D9DFF",
    borderStyle: "solid",
    borderWidth: 1,
    paddingVertical: 16,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#A09D9DFF',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#888888',
    paddingRight: 10,
    textAlign: 'center',
  },
  eyeIcon: {
    paddingLeft: 5,
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  buttonInput: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 25,
    borderColor: "#A09D9DFF",
    borderStyle: "solid",
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#A09D9DFF',
  },
  button: {
    width: '100%',
    backgroundColor: '#09AC4DFF',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    fontWeight: 'bold',
  },
  formCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderStyle: 'solid',
    overflow: 'hidden',
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    borderColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  formCardGeneral: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    borderColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ffffff',
  },
  linksContainer: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  linkText: {
    color: '#fff',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 0,
    textAlign: 'center',
  }
});