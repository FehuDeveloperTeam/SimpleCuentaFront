// components/ui/GradientBackground.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue } from 'react-native';

// Definimos las propiedades que aceptará nuestro componente
interface GradientBackgroundProps {
  children: React.ReactNode; // Para que pueda envolver a otros componentes
  colors: readonly [ColorValue, ColorValue, ...ColorValue[]]; // Un array con al menos dos colores
}
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, colors = ['#3A86FF', '#6D2932', '#101D2E']}) => {
  return (
    <LinearGradient
      // Los colores se aplican desde el primero (arriba) hasta el último (abajo)
      colors={colors}
      style={styles.gradient}
    >
      {/* Aquí se renderizará el contenido de la pantalla */}
      {children}
    </LinearGradient>
  );
};