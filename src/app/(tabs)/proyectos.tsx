import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// --- TIPOS ---
interface Proyecto {
  id: string;
  titulo: string;
  descripcion: string;
  porcentaje: number;
  imagen: any;       // ← aquí va tu require(imagen)
  esNuevo?: boolean;
}

// --- DATOS --- (cambia las imágenes por tus require)
const proyectos: Proyecto[] = [
  {
    id: '1',
    titulo: 'El cuerpo humano',
    descripcion: 'Descubre cómo funciona tu cuerpo y la importancia del autocuidado.',
    porcentaje: 75,
    imagen: require('../../../assets/images/proyectos/proyecto1.png'), // 👈 cambia esto
  },
  {
    id: '2',
    titulo: 'Biodiversidad y medio ambiente',
    descripcion: 'Explora la riqueza natural y aprende a proteger nuestro planeta.',
    porcentaje: 50,
    imagen: require('../../../assets/images/proyectos/proyecto2.png'), // 👈 cambia esto
  },
  {
    id: '3',
    titulo: 'Propiedades de los materiales',
    descripcion: 'Investiga de qué están hechas las cosas y sus transformaciones.',
    porcentaje: 25,
    imagen: require('../../../assets/images/proyectos/proyecto3.png'), // 👈 cambia esto
  },
  {
    id: '4',
    titulo: 'El Sistema Solar y el Universo',
    descripcion: 'Viaja por las estrellas y descubre los secretos del cosmos.',
    porcentaje: 0,
    esNuevo: true,
    imagen: require('../../../assets/images/proyectos/proyecto4.png'), // 👈 cambia esto
  },
  {
    id: '5',
    titulo: 'Fuerzas y movimiento',
    descripcion: 'Comprende cómo los objetos se mueven y qué los hace cambiar.',
    porcentaje: 10,
    imagen: require('../../../assets/images/proyectos/proyecto5.png'), // 👈 cambia esto
  },
];

// --- BARRA DE PROGRESO ---
const BarraProgreso = ({ porcentaje }: { porcentaje: number }) => (
  <View style={styles.barraContainer}>
    <View style={styles.barraFondo}>
      <View style={[styles.barraRelleno, { width: `${porcentaje}%` }]} />
    </View>
    <Text style={styles.barraTexto}>{porcentaje}%</Text>
  </View>
);

// --- TARJETA PROYECTO ---
const TarjetaProyecto = ({ proyecto }: { proyecto: Proyecto }) => (
  <TouchableOpacity style={styles.tarjeta} activeOpacity={0.82}>
    {/* Imagen circular */}
    <View style={styles.imagenContainer}>
      <Image source={proyecto.imagen} style={styles.imagen} resizeMode="cover" />
    </View>

    {/* Info */}
    <View style={styles.info}>
      <View style={styles.tituloFila}>
        <Text style={styles.titulo} numberOfLines={2}>{proyecto.titulo}</Text>
        {proyecto.esNuevo && (
          <View style={styles.badgeNuevo}>
            <Text style={styles.badgeTexto}>Nuevo</Text>
          </View>
        )}
      </View>
      <Text style={styles.descripcion} numberOfLines={3}>{proyecto.descripcion}</Text>
      <BarraProgreso porcentaje={proyecto.porcentaje} />
    </View>

    {/* Flecha */}
    <Text style={styles.flecha}>›</Text>
  </TouchableOpacity>
);

// --- PANTALLA ---
export default function ProyectosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnBack}>
          <Text style={styles.btnBackTexto}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>Pensamiento Científico</Text>
        <View style={styles.headerIcono}>
          {/* Aquí va el ícono del campo si lo tienes */}
          <Text style={styles.headerEmoji}>🤖</Text>
        </View>
      </View>

      {/* LISTA */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {proyectos.map((proyecto) => (
          <TarjetaProyecto key={proyecto.id} proyecto={proyecto} />
        ))}

        {/* FOOTER INFO */}
        <View style={styles.footerCard}>
          <View style={styles.footerIconoBg}>
            <Image
              source={require('../../../assets/imagenes_F/1.carpeta.png')} // 👈 cambia si tienes otro ícono
              style={styles.footerIcono}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.footerTexto}>
            Cada campo tiene varios proyectos. Completa para avanzar y desbloquear más.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F7FF',
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFF8',
    gap: 10,
  },
  btnBack: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F0EFF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBackTexto: {
    fontSize: 24,
    color: '#5B21B6',
    lineHeight: 28,
  },
  headerTitulo: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  headerIcono: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerEmoji: {
    fontSize: 20,
  },

  // SCROLL
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },

  // TARJETA
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  imagenContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#EDE9FE',
    flexShrink: 0,
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  tituloFila: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    flexWrap: 'wrap',
  },
  titulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1B4B',
    flex: 1,
    lineHeight: 20,
  },
  descripcion: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
  flecha: {
    fontSize: 28,
    color: '#C4B5FD',
    marginLeft: 4,
  },

  // BADGE NUEVO
  badgeNuevo: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  badgeTexto: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // BARRA
  barraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  barraFondo: {
    flex: 1,
    height: 5,
    backgroundColor: '#EDE9FE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barraRelleno: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 10,
  },
  barraTexto: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
    minWidth: 28,
  },

  // FOOTER
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  footerIconoBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  footerIcono: {
    width: 26,
    height: 26,
  },
  footerTexto: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
});
