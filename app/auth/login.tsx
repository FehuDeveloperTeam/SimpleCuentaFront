// app/auth/login.tsx
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { GradientBackground } from '../../components/ui/GradientBackground'; // 1. Importa TU componente reutilizable

// 2. Define la paleta de colores para el fondo
const LOGIN_GRADIENT_COLORS: readonly [string, string, string] = ['#1C1C1E', '#F2F2F7', '#2C2C2E']; // Bosque Esmeralda a CEO Nocturno

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      await signIn({ token: response.data.token, user: response.data.user });
      router.replace('/(tabs)');
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error('Error al iniciar sesión:', err.response ? err.response.data : 'Error desconocido');
      Alert.alert(
        'Error al iniciar sesión',
        err.response?.data?.message || 'Ocurrió un error inesperado.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // ... Tu lógica de handleGoogleLogin se mantiene igual
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let idToken: string | undefined = undefined;
if ('idToken' in userInfo && typeof userInfo.idToken === 'string') {
  idToken = userInfo.idToken;
}
      
      if (!idToken) {
        throw new Error('No se pudo obtener el idToken de Google.');
      }
      
      const response = await api.post('/api/auth/google', { token: idToken });
      await signIn({ token: response.data.token, user: response.data.user });
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('Error en Google Sign-In:', error);
      const err = error as { code?: string };
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (err.code === statusCodes.IN_PROGRESS) {
        Alert.alert('En progreso', 'El inicio de sesión ya está en curso.');
      } else {
        Alert.alert('Error', 'Ocurrió un error al iniciar sesión con Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // 3. Usa tu componente GradientBackground como el contenedor principal
    <GradientBackground colors={LOGIN_GRADIENT_COLORS}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <BlurView intensity={20} tint="light" style={styles.formCardGeneral}>
            <View style={styles.formCard}>
              <Text style={styles.title}>Inicia sesión</Text>
              {/* ... El resto de tu formulario se mantiene exactamente igual ... */}
              <TextInput style={styles.buttonInput} placeholder="Correo electrónico" placeholderTextColor={'#888'} textAlign='right' keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
              <View style={styles.passwordInputContainer}>
                <TextInput style={styles.passwordInput} placeholder="Contraseña" placeholderTextColor={'#888'} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="gray" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Cargando..." : "Iniciar Sesión"}</Text>
              </TouchableOpacity>
              <View style={styles.socialButtonsContainer}>
                <GoogleSigninButton style={styles.googleButton} size={GoogleSigninButton.Size.Wide} color={GoogleSigninButton.Color.Dark} onPress={handleGoogleLogin} disabled={loading} />
              </View>
              <View style={styles.linksContainer}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.linkText}>¿No tienes cuenta?</Text>
                  <TouchableOpacity style={styles.button} onPress={() => router.replace('/auth/register')} disabled={loading}>
                    <Text style={styles.buttonText}>Regístrate</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </BlurView>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

// 4. Estilos limpiados y corregidos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // ... El resto de tus estilos (formCard, button, etc.) se mantienen igual
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
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    color: '#ffffff',
    paddingRight: 10,
    textAlign: 'center',
  },
  eyeIcon: {
    paddingLeft: 5,
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
    color: '#ffffff',
    textAlign: 'center',
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
  },
  formCardGeneral: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  title: {
    fontSize: 32,
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
    fontSize: 16,
    paddingVertical: 0,
    paddingHorizontal: 0,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  googleButton: {
    width: '100%',
    height: 48,
  }
});
