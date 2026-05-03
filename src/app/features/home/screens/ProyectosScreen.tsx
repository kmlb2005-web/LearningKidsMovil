import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// --- DATOS ESTÁTICOS ---
const proyectos = [
  {
    id: '1',
    titulo: 'El cuerpo humano',
    descripcion: 'Descubre cómo funciona tu cuerpo y la importancia del autocuidado.',
  },
  {
    id: '2',
    titulo: 'Biodiversidad y medio ambiente',
    descripcion: 'Explora la riqueza natural y aprende a proteger nuestro planeta.',
  },
  {
    id: '3',
    titulo: 'Propiedades de los materiales',
    descripcion: 'Investiga de qué están hechas las cosas y sus transformaciones.',
  },
  {
    id: '4',
    titulo: 'El Sistema Solar y el Universo',
    descripcion: 'Viaja por las estrellas y descubre los secretos del cosmos.',
  },
  {
    id: '5',
    titulo: 'Fuerzas y movimiento',
    descripcion: 'Comprende cómo los objetos se mueven y qué los hace cambiar.',
  },
];

// --- COMPONENTE TARJETA ---
const TarjetaProyecto = ({
  titulo,
  descripcion,
}: {
  titulo: string;
  descripcion: string;
}) => (
  <TouchableOpacity style={styles.tarjeta} activeOpacity={0.8}>

    {/* Espacio reservado para imagen - reemplaza este View por un <Image> cuando tengas las imágenes */}
    <View style={styles.imagenPlaceholder}>
      {/* Aquí va la imagen */}
    </View>

    {/* Contenido textual */}
    <View style={styles.contenido}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.descripcion}>{descripcion}</Text>
    </View>

    {/* Indicador de navegación */}
    <Text style={styles.flecha}>›</Text>

  </TouchableOpacity>
);

// --- PANTALLA PRINCIPAL ---
export default function ProyectosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnBack}>
          <Text style={styles.btnBackTexto}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Pensamiento Científico</Text>
        {/* Espacio reservado para ícono del campo - reemplaza por <Image> cuando tengas el ícono */}
        <View style={styles.headerIconoPlaceholder} />
      </View>

      {/* LISTA CON SCROLL */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {proyectos.map((proyecto) => (
          <TarjetaProyecto
            key={proyecto.id}
            titulo={proyecto.titulo}
            descripcion={proyecto.descripcion}
          />
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({

  // Contenedor principal
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 10,
  },
  btnBack: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBackTexto: {
    fontSize: 24,
    color: '#374151',
    lineHeight: 28,
  },
  headerTitulo: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  // Espacio reservado para ícono del campo en el header
  headerIconoPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EDE9FE',
  },

  // SCROLL
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },

  // TARJETA
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    // Sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    // Sombra Android
    elevation: 3,
  },

  // Placeholder de imagen circular (lado izquierdo)
  // Reemplaza este View por <Image source={require('...')} style={styles.imagenPlaceholder} />
  imagenPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
    flexShrink: 0,
  },

  // Bloque de texto (centro)
  contenido: {
    flex: 1,
    gap: 4,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 21,
  },
  descripcion: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },

  // Flecha de navegación (lado derecho)
  flecha: {
    fontSize: 26,
    color: '#D1D5DB',
    flexShrink: 0,
  },
});
