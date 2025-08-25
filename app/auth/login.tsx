// app/auth/login.tsx
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../lib/api'; // <--- ¡RUTA AJUSTADA!

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Inicializa el router de Expo

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
      // TODO: Navegar a la pantalla principal de la aplicación
      // Si el login es exitoso, redirigimos a la ruta principal de la aplicación, que es (tabs)
      router.replace('/(tabs)'); // Esto navegará a la ruta /app/(tabs)/index.tsx por defecto
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

return (
  <ImageBackground source={require('../../assets/imagesApp/background0.jpg')} style={styles.backgroundImage}>
  <LinearGradient
    colors={['transparent', 'transparent']} // Colores de tu degradado (ej. de gris claro a blanco)
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

        <View style={styles.passwordInputContainer}> {/* <-- Nuevo contenedor */}
          <TextInput
            style={styles.passwordInput} // <-- Estilo específico para el input dentro del contenedor
            placeholder="Contraseña"
            placeholderTextColor={'#888'}
            secureTextEntry={!showPassword} // <-- Controla la visibilidad con el estado
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)} // <-- Cambia el estado al tocar
            style={styles.eyeIcon} // <-- Estilo para el icono
          >
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'} // <-- Cambia el icono según el estado
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin} // O handleRegister
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>

         <View style={styles.linksContainer}>
          <View style={{ alignItems: 'center' }}>
          <Text style={styles.linkText}>
                ¿No tienes cuenta?
              </Text>
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
    {/* Closing tag for LinearGradient */}
  </LinearGradient>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
   backgroundImage: {
    flex: 1, // Esto hace que la imagen ocupe todo el espacio disponible
    width: '100%', // Asegura que la imagen tenga el ancho completo
    height: '100%', // Asegura que la imagen tenga el alto completo
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
  },
 passwordInputContainer: {
    flexDirection: 'row', // Para que el input y el icono estén en la misma línea
    width: '100%',
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'transparent', // El verde característico de Pinterest
    borderRadius: 25, // Muy redondeado (como una píldora)
    borderColor: "#A09D9DFF",
    borderStyle: "solid",
    borderWidth: 1,
    paddingVertical: 16,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: '#A09D9DFF', // Texto blanco
  },
  passwordInput: {
    flex: 1, // Hace que el input ocupe el mayor espacio posible
    height: '100%', // El input ocupa el alto del contenedor
    fontSize: 16,
    color: '#888888', // Color del texto del input
    paddingRight: 10, // Espacio entre el texto y el icono
    textAlign: 'center', // Centra el texto dentro del input
  },
  eyeIcon: {
    paddingLeft: 5, // Espacio a la izquierda del icono
  },
  gradientBackground: {
    // Fondo transparente para que se vea el degradado
  },
  
  buttonInput: {
    width: '100%',
    backgroundColor: 'transparent', // El verde característico de Pinterest
    borderRadius: 25, // Muy redondeado (como una píldora)
    borderColor: "#A09D9DFF",
    borderStyle: "solid",
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 60,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    color: '#A09D9DFF', // Texto blanco
  },
  button: {
    width: '100%',
    backgroundColor: '#09AC4DFF', // El verde característico de Pinterest
    borderRadius: 25, // Muy redondeado (como una píldora)
    paddingVertical: 15,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    
    color: '#ffffff', // Texto blanco
    fontSize: 20,
    fontWeight: 'bold',
  },
  formCard: {
    width: '100%', // O un ancho fijo, ej. 350
    maxWidth: 400, // Para pantallas grandes
    backgroundColor: 'transparent', // Fondo blanco para la tarjeta
    borderRadius: 20, // Esquinas redondeadas
    borderStyle: 'solid',
    //borderWidth: 1,
    overflow: 'hidden',
    padding: 30, // Espaciado interno
    alignItems: 'center',
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 5 },
    borderColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8, // Sombra para Android
  },
  formCardGeneral: {
    width: '100%', // O un ancho fijo, ej. 350
    maxWidth: 400, // Para pantallas grandes
    backgroundColor: 'transparent', // Fondo blanco para la tarjeta
    borderRadius: 20, // Esquinas redondeadas
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    padding: 30, // Espaciado interno
    alignItems: 'center',
    shadowColor: '#000', // Sombra
    shadowOffset: { width: 0, height: 5 },
    borderColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8, // Sombra para Android
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent', // Fondo transparente para que se vea el degradado
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ffffff', // Texto blanco
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f8f8f8', // Un gris muy claro para el fondo del input
    borderRadius: 10, // Esquinas más redondeadas
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Borde suave
    fontSize: 16,
    color: '#333',
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
});