import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// --- TIPOS ---
interface Materia {
  id: string;
  nombre: string;
  porcentaje: number | null;
  imagen: any;
  color: string;
  barraColor: string;
  bgColor: string;
}

// --- DATOS ---
const materias: Materia[] = [
  {
    id: '1',
    nombre: 'Pensamiento\nCientífico',
    porcentaje: 60,
    imagen: require('../../../assets/imagenes_F/1.MICROSC.png'),
    color: '#2563EB',
    barraColor: '#2563EB',
    bgColor: '#EFF6FF',
  },
  {
    id: '2',
    nombre: 'Matemáticas',
    porcentaje: 45,
    imagen: require('../../../assets/imagenes_F/1.calculadora.png'),
    color: '#7C3AED',
    barraColor: '#7C3AED',
    bgColor: '#F5F3FF',
  },
  {
    id: '3',
    nombre: 'Lenguajes',
    porcentaje: 30,
    imagen: require('../../../assets/imagenes_F/1.libro.png'),
    color: '#D97706',
    barraColor: '#F59E0B',
    bgColor: '#FFFBEB',
  },
  {
    id: '4',
    nombre: 'Formación\nCívica',
    porcentaje: 20,
    imagen: require('../../../assets/imagenes_F/1.mundo.png'),
    color: '#16A34A',
    barraColor: '#22C55E',
    bgColor: '#F0FDF4',
  },
];

const instrucciones = [
  {
    id: '1',
    icono: require('../../../assets/imagenes_F/1.lista.png'),
    iconoBg: '#DBEAFE',
    texto:
      'Elige uno de los 4 campos formativos para empezar tu aventura de aprendizaje.',
  },
  {
    id: '2',
    icono: require('../../../assets/imagenes_F/1.carpeta.png'),
    iconoBg: '#EDE9FE',
    texto:
      'Cada campo tiene varios proyectos. Completa para avanzar y desbloquear más.',
  },
  {
    id: '3',
    icono: require('../../../assets/imagenes_F/1.lista.png'),
    iconoBg: '#FEF3C7',
    texto:
      'Cada proyecto tiene temas organizados paso a paso. Avanza y desbloquea.',
  },
  {
    id: '4',
    icono: require('../../../assets/imagenes_F/1.paloma.png'),
    iconoBg: '#DCFCE7',
    texto:
      'Cada tema tiene pruebas para practicar y un examen final para evaluar.',
  },
];

// --- BARRA DE PROGRESO ---
const BarraProgreso = ({
  porcentaje,
  color,
}: {
  porcentaje: number;
  color: string;
}) => (
  <View style={styles.barraContainer}>
    <View style={styles.barraFondo}>
      <View
        style={[
          styles.barraRelleno,
          {
            width: `${porcentaje}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>

    <Text style={[styles.barraTexto, { color }]}>
      {porcentaje}%
    </Text>
  </View>
);

// --- TARJETA MATERIA ---
const TarjetaMateria = ({ materia }: { materia: Materia }) => (
  <TouchableOpacity
    style={[
      styles.tarjeta,
      { backgroundColor: materia.bgColor },
    ]}
    activeOpacity={0.85}
  >
    <Image
      source={materia.imagen}
      style={styles.tarjetaImagen}
      resizeMode="contain"
    />

    <Text
      style={[
        styles.tarjetaNombre,
        { color: materia.color },
      ]}
    >
      {materia.nombre}
    </Text>

    {materia.porcentaje !== null && (
      <BarraProgreso
        porcentaje={materia.porcentaje}
        color={materia.barraColor}
      />
    )}
  </TouchableOpacity>
);

// --- PANTALLA HOME ---
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#DBEAFE"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require('../../../assets/imagenes_F/1.fondok.png')}
            style={styles.robotImagen}
            resizeMode="contain"
          />

          <View style={styles.headerTextos}>
            <Text style={styles.saludo}>
              ¡Hola, Louz! 👋
            </Text>

            <Text style={styles.subtitulo}>
              ¿Qué quieres aprender hoy?
            </Text>
          </View>
        </View>

        {/* GRID DE MATERIAS */}
        <View style={styles.grid}>
          {materias.map((materia) => (
            <TarjetaMateria
              key={materia.id}
              materia={materia}
            />
          ))}
        </View>

        {/* INSTRUCCIONES */}
        <View style={styles.instruccionesCard}>
          {instrucciones.map((inst) => (
            <View
              key={inst.id}
              style={styles.instruccionFila}
            >
              <View
                style={[
                  styles.instruccionIconoBg,
                  {
                    backgroundColor: inst.iconoBg,
                  },
                ]}
              >
                <Image
                  source={inst.icono}
                  style={styles.instruccionIcono}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.instruccionTexto}>
                {inst.texto}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../../assets/imagenes_F/1.inicio.png')}
            style={[
              styles.navIcono,
              { tintColor: '#2563EB' },
            ]}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.navTexto,
              { color: '#2563EB' },
            ]}
          >
            Inicio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../../assets/imagenes_F/1.avances.png')}
            style={[
              styles.navIcono,
              { tintColor: '#9CA3AF' },
            ]}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.navTexto,
              { color: '#9CA3AF' },
            ]}
          >
            Mis avances
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../../assets/imagenes_F/1.PERFIL.png')}
            style={[
              styles.navIcono,
              { tintColor: '#9CA3AF' },
            ]}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.navTexto,
              { color: '#9CA3AF' },
            ]}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F6FF',
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 20,
  },

  robotImagen: {
    width: 110,
    height: 110,
    marginRight: 14,
  },

  headerTextos: {
    flex: 1,
  },

  saludo: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 6,
  },

  subtitulo: {
    fontSize: 15,
    color: '#4B7AB8',
    fontWeight: '500',
  },

  // GRID
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },

  tarjeta: {
    width: '47%',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  tarjetaImagen: {
    width: 84,
    height: 84,
    marginBottom: 10,
  },

  tarjetaNombre: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },

  // BARRA DE PROGRESO
  barraContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  barraFondo: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
  },

  barraRelleno: {
    height: '100%',
    borderRadius: 10,
  },

  barraTexto: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 30,
  },

  // INSTRUCCIONES
  instruccionesCard: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    gap: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  instruccionFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  instruccionIconoBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  instruccionIcono: {
    width: 26,
    height: 26,
  },

  instruccionTexto: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },

  // NAVBAR
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
  },

  navItem: {
    alignItems: 'center',
    gap: 4,
  },

  navIcono: {
    width: 24,
    height: 24,
  },

  navTexto: {
    fontSize: 11,
    fontWeight: '600',
  },
});