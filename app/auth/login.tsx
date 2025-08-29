// app/auth/login.tsx
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // useRouter se mantiene para ir a registro
import React, { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext'; // <-- 1. IMPORTAMOS EL HOOK
import api from '../../lib/api';

export default function LoginScreen() {
  const { signIn } = useAuth(); // <-- 2. OBTENEMOS LA FUNCIÓN signIn DEL CONTEXTO
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
      
       // --- INICIO DE CAMBIO (ESPÍA) ---
    // 1. Mostraremos en la consola la respuesta EXACTA que nos da el backend.
    console.log('✅ Respuesta exitosa del backend:', JSON.stringify(response.data, null, 2));
    // --- FIN DE CAMBIO (ESPÍA) ---

      // <-- 3. USAMOS EL CONTEXTO PARA INICIAR SESIÓN
      // La respuesta del backend debe incluir 'token' y 'user'
      await signIn({ token: response.data.token, user: response.data.user });
      router.replace('/(tabs)');
      // Ya no necesitamos la alerta de éxito ni la redirección manual.
      // El _layout se encargará de redirigir al cambiar el estado de autenticación.

    } catch (error) {
      // Tu manejo de errores existente es correcto
      const err = error as { response?: { data?: { message?: string } }; message?: string };

// --- INICIO DE CAMBIO (ESPÍA) ---
    // 2. Si hay un error, también mostraremos la respuesta completa del backend.
    console.error('❌ Error en la respuesta del backend:', JSON.stringify(err.response?.data, null, 2));
    // --- FIN DE CAMBIO (ESPÍA) ---

      console.error('Error al iniciar sesión:', err.response ? err.response.data : err.message);
      Alert.alert(
        'Error al iniciar sesión',
        err.response?.data?.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
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
      //const idToken = userInfo.idToken;
      
      if (!idToken) {
        throw new Error('No se pudo obtener el idToken de Google.');
      }
      
      const response = await api.post('/api/auth/google', { token: idToken });
      
      // <-- 4. USAMOS EL CONTEXTO TAMBIÉN PARA EL LOGIN CON GOOGLE
      await signIn({ token: response.data.token, user: response.data.user });

      router.replace('/(tabs)');
      
    } catch (error) {
      // Tu manejo de errores de Google es correcto
      console.error('Error en Google Sign-In:', error);
      const err = error as { code?: string };
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        // No mostramos alerta si el usuario cancela
      } else if (err.code === statusCodes.IN_PROGRESS) {
        Alert.alert('En progreso', 'El inicio de sesión ya está en curso.');
      } else {
        Alert.alert('Error', 'Ocurrió un error al iniciar sesión con Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ... El resto de tu código JSX y estilos permanece exactamente igual
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
                    onPress={() => router.replace('/auth/register')}
                    disabled={loading}>
                    <Text style={styles.buttonText}>
                      Regístrate
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

// ... Tus estilos
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