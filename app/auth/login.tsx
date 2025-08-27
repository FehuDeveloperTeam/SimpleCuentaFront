// app/auth/login.tsx
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin'; // <-- NUEVA IMPORTACIÓN
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../lib/api'; // <--- ¡RUTA AJUSTADA!

// Configuración de Google Sign-In para Android e iOS
// Esto debe ir en un lugar global, como tu archivo principal (ej. app/_layout.tsx)
// Pero lo incluimos aquí para que el código sea autocontenido.
GoogleSignin.configure({
  webClientId: 'TU_ID_DE_CLIENTE_WEB_DEL_BACKEND', // Reemplaza con tu ID de cliente web
  iosClientId: 'TU_ID_DE_CLIENTE_DE_IOS_DE_GOOGLE', // Reemplaza con tu ID de cliente de iOS
});

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Inicializa el router de Expo

  // Lógica de inicio de sesión con email y contraseña
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Usuario o contraseña incorrectos, intenta nuevamente');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      Alert.alert('¡Éxito!', response.data.message || 'Inicio de sesión exitoso.');
      console.log('Token JWT:', response.data.token);
      // TODO: Guardar el token de autenticación (ej. con AsyncStorage)
      router.replace('/(tabs)');
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: any }; message?: string };
        console.error('Error al iniciar sesión:', err.response ? err.response.data : err.message);
        Alert.alert(
          'Error al iniciar sesión',
          err.response?.data?.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.'
        );
      } else {
        console.error('Error al iniciar sesión:', String(error));
        Alert.alert(
          'Error al iniciar sesión',
          'Ocurrió un error inesperado. Inténtalo de nuevo.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Lógica de inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      // Intenta iniciar sesión con los servicios de Google
      await GoogleSignin.hasPlayServices();
       const userInfo = await GoogleSignin.signIn();
       const idToken = (userInfo as any).idToken;
      
      if (!idToken) {
        throw new Error('idToken no se pudo obtener.');
      }
      
      // Envía el idToken a tu backend para verificación y obtener tu token JWT
      setLoading(true);
      const response = await api.post('/api/auth/google', { token: idToken });
      
      const data = response.data;
      console.log('Login exitoso con Google. Token del backend:', data.token);
      Alert.alert('¡Éxito!', 'Inicio de sesión con Google exitoso.');
      
      // TODO: Guardar el token del backend
      router.replace('/(tabs)');
      
    } catch (error) {
      console.error('Error en Google Sign-In:', error);

      if (typeof error === 'object' && error !== null && 'code' in error) {
    const err = error as { code?: string };
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Login cancelado', 'El usuario canceló el proceso de inicio de sesión.');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        Alert.alert('En progreso', 'El inicio de sesión ya está en curso. Por favor, espera.');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services no está disponible en este dispositivo.');
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado al iniciar sesión con Google.');
      }
    }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../assets/imagesApp/background0.jpg')} style={styles.backgroundImage}>
      <LinearGradient
        colors={['transparent', 'transparent']}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          <BlurView intensity={20} tint="light" style={styles.formCardGeneral}>
            <View style={styles.formCard}>
              <Text style={styles.title}>Inicia sesión</Text>
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
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Cargando..." : "Iniciar Sesión"}
                </Text>
              </TouchableOpacity>

              {/* Contenedor para el botón de Google */}
              <View style={styles.socialButtonsContainer}>
                <GoogleSigninButton
                  style={styles.googleButton}
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={handleGoogleLogin}
                  disabled={loading}
                />
              </View>

              <View style={styles.linksContainer}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.linkText}>¿No tienes cuenta?</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace('/auth/register' as any)}
                    disabled={loading}>
                    <Text style={styles.buttonText}>
                      {loading ? "Cargando..." : "Regístrate"}
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
