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
interface Tema {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'completado' | 'disponible' | 'bloqueado';
}

// --- DATOS ---
const temas: Tema[] = [
  {
    id: 1,
    titulo: 'Los órganos y sus funciones',
    descripcion: 'Conoce los órganos principales y qué hacen.',
    estado: 'completado',
  },
  {
    id: 2,
    titulo: 'Sistemas del cuerpo',
    descripcion: 'Aprende cómo trabajan juntos los sistemas del cuerpo.',
    estado: 'disponible',
  },
  {
    id: 3,
    titulo: 'Alimentación y nutrición',
    descripcion: 'Descubre cómo los alimentos nos dan energía.',
    estado: 'bloqueado',
  },
  {
    id: 4,
    titulo: 'Hábitos saludables',
    descripcion: 'Aprende hábitos que cuidan tu cuerpo y tu mente.',
    estado: 'bloqueado',
  },
  {
    id: 5,
    titulo: 'Prevención de enfermedades',
    descripcion: 'Conoce cómo prevenir y cuidar tu salud cada día.',
    estado: 'bloqueado',
  },
];

// --- ÍCONO DE ESTADO ---
const IconoEstado = ({ estado }: { estado: Tema['estado'] }) => {
  if (estado === 'completado') {
    return (
      <View style={styles.iconoCompletado}>
        <Text style={styles.iconoCheckTexto}>✓</Text>
      </View>
    );
  }
  if (estado === 'disponible') {
    return (
      <View style={styles.iconoDisponible}>
        <Text style={styles.iconoFlechaTexto}>›</Text>
      </View>
    );
  }
  return (
    <View style={styles.iconoBloqueado}>
      <Text style={styles.iconoCandadoTexto}>🔒</Text>
    </View>
  );
};

// --- COLOR DEL NÚMERO ---
const colorNumero = (estado: Tema['estado']) => {
  if (estado === 'completado') return '#22C55E';
  if (estado === 'disponible') return '#F59E0B';
  return '#D1D5DB';
};

const bgNumero = (estado: Tema['estado']) => {
  if (estado === 'completado') return '#DCFCE7';
  if (estado === 'disponible') return '#FEF3C7';
  return '#F3F4F6';
};

// --- TARJETA TEMA ---
const TarjetaTema = ({ tema }: { tema: Tema }) => {
  const bloqueado = tema.estado === 'bloqueado';
  return (
    <TouchableOpacity
      style={[styles.tarjeta, bloqueado && styles.tarjetaBloqueada]}
      activeOpacity={bloqueado ? 1 : 0.8}
      disabled={bloqueado}
    >
      {/* Número */}
      <View style={[styles.numeroBg, { backgroundColor: bgNumero(tema.estado) }]}>
        <Text style={[styles.numeroTexto, { color: colorNumero(tema.estado) }]}>
          {tema.id}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.infoTema}>
        <Text style={[styles.temaTitulo, bloqueado && styles.textoDesactivado]}>
          {tema.titulo}
        </Text>
        <Text style={[styles.temaDescripcion, bloqueado && styles.textoDesactivado]}>
          {tema.descripcion}
        </Text>
      </View>

      {/* Ícono estado */}
      <IconoEstado estado={tema.estado} />
    </TouchableOpacity>
  );
};

// --- PANTALLA ---
export default function TemasScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnBack}>
          <Text style={styles.btnBackTexto}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>El cuerpo humano</Text>
        <View style={styles.puntajeContainer}>
          <Text style={styles.puntajeEmoji}>🏆</Text>
          <Text style={styles.puntajeTexto}>120</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* CARD RESUMEN DEL PROYECTO */}
        <View style={styles.resumenCard}>
          {/* Imagen del personaje - 👇 cambia este require */}
          <Image
            source={require('../../../assets/images/CamposFormativos/louzSaludando.png')}
            style={styles.resumenImagen}
            resizeMode="contain"
          />
          <View style={styles.resumenInfo}>
            <Text style={styles.resumenTitulo}>El cuerpo humano</Text>
            <Text style={styles.resumenDescripcion}>
              Descubre cómo funciona tu cuerpo y la importancia del autocuidado.
            </Text>
            {/* Barra de progreso */}
            <View style={styles.barraContainer}>
              <View style={styles.barraFondo}>
                <View style={[styles.barraRelleno, { width: '75%' }]} />
              </View>
              <Text style={styles.barraTexto}>75%</Text>
            </View>
          </View>
        </View>

        {/* LISTA DE TEMAS */}
        <View style={styles.listaTemas}>
          {temas.map((tema) => (
            <TarjetaTema key={tema.id} tema={tema} />
          ))}
        </View>

        {/* IMAGEN DECORATIVA DEL FONDO - 👇 cambia este require */}
        <Image
          source={require('../../../assets/images/CamposFormativos/fondo arriba.png')}
          style={styles.imagenDecorativa}
          resizeMode="cover"
        />

        {/* FOOTER INFO */}
        <View style={styles.footerCard}>
          {/* Ícono - 👇 cambia este require si tienes otro */}
          <Image
            source={require('../../../assets/imagenes_F/1.lista.png')}
            style={styles.footerIcono}
            resizeMode="contain"
          />
          <Text style={styles.footerTexto}>
            Cada proyecto tiene temas organizados paso a paso. Avanza y desbloquea.
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
  puntajeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  puntajeEmoji: {
    fontSize: 16,
  },
  puntajeTexto: {
    fontSize: 15,
    fontWeight: '800',
    color: '#D97706',
  },

  // SCROLL
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },

  // CARD RESUMEN
  resumenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  resumenImagen: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EDE9FE',
    flexShrink: 0,
  },
  resumenInfo: {
    flex: 1,
    gap: 4,
  },
  resumenTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  resumenDescripcion: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
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
  },

  // LISTA TEMAS
  listaTemas: {
    marginHorizontal: 16,
    marginTop: 16,
    gap: 10,
  },

  // TARJETA TEMA
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  tarjetaBloqueada: {
    opacity: 0.65,
  },
  numeroBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  numeroTexto: {
    fontSize: 15,
    fontWeight: '800',
  },
  infoTema: {
    flex: 1,
    gap: 2,
  },
  temaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  temaDescripcion: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
  textoDesactivado: {
    color: '#9CA3AF',
  },

  // ÍCONOS DE ESTADO
  iconoCompletado: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconoCheckTexto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  iconoDisponible: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconoFlechaTexto: {
    color: '#6B7280',
    fontSize: 22,
    lineHeight: 26,
  },
  iconoBloqueado: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconoCandadoTexto: {
    fontSize: 18,
  },

  // IMAGEN DECORATIVA
  imagenDecorativa: {
    width: '100%',
    height: 120,
    marginTop: 20,
  },

  // FOOTER
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  footerIcono: {
    width: 30,
    height: 30,
    flexShrink: 0,
  },
  footerTexto: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
});
