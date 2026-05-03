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
const subtemas = [
  {
    id: '1',
    titulo: 'Los órganos y sus funciones',
    descripcion: 'Conoce los órganos principales y qué hacen.',
    icono: 'check',
  },
  {
    id: '2',
    titulo: 'Sistemas del cuerpo',
    descripcion: 'Aprende cómo trabajan juntos los sistemas del cuerpo.',
    icono: 'flecha',
  },
  {
    id: '3',
    titulo: 'Alimentación y nutrición',
    descripcion: 'Descubre cómo los alimentos nos dan energía.',
    icono: 'candado',
  },
  {
    id: '4',
    titulo: 'Hábitos saludables',
    descripcion: 'Aprende hábitos que cuidan tu cuerpo y tu mente.',
    icono: 'candado',
  },
  {
    id: '5',
    titulo: 'Prevención de enfermedades',
    descripcion: 'Conoce cómo prevenir y cuidar tu salud cada día.',
    icono: 'candado',
  },
];

// --- ÍCONO DE ESTADO ---
const IconoEstado = ({ tipo }: { tipo: string }) => {
  if (tipo === 'check') {
    return (
      <View style={styles.iconoCheck}>
        {/* Aquí va el icono de estado */}
        <Text style={styles.iconoCheckTexto}>✓</Text>
      </View>
    );
  }
  if (tipo === 'flecha') {
    return (
      <View style={styles.iconoFlecha}>
        {/* Aquí va el icono de estado */}
        <Text style={styles.iconoFlechaTexto}>›</Text>
      </View>
    );
  }
  return (
    <View style={styles.iconoCandado}>
      {/* Aquí va el icono de estado */}
      <Text style={styles.iconoCandadoTexto}>🔒</Text>
    </View>
  );
};

// --- TARJETA SUBTEMA ---
const TarjetaSubtema = ({
  titulo,
  descripcion,
  icono,
  bloqueado,
}: {
  titulo: string;
  descripcion: string;
  icono: string;
  bloqueado: boolean;
}) => (
  <View style={[styles.tarjeta, bloqueado && styles.tarjetaBloqueada]}>

    {/* Círculo indicador izquierdo */}
    <View style={[styles.circulo, bloqueado && styles.circuloBloqueado]}>
      {/* Indicador visual (número o estado) */}
    </View>

    {/* Contenido textual */}
    <View style={styles.contenido}>
      <Text style={[styles.subtitulo, bloqueado && styles.textoApagado]}>
        {titulo}
      </Text>
      <Text style={[styles.descripcion, bloqueado && styles.textoApagado]}>
        {descripcion}
      </Text>
    </View>

    {/* Ícono de estado derecho */}
    <IconoEstado tipo={icono} />

  </View>
);

// --- PANTALLA PRINCIPAL ---
export default function TemasScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnBack}>
          <Text style={styles.btnBackTexto}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>El cuerpo humano</Text>
        {/* Espaciador para centrar el título */}
        <View style={styles.headerEspaciador} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* CARD PRINCIPAL DEL TEMA */}
        <View style={styles.cardPrincipal}>
          <View style={styles.cardFila}>

            {/* Espacio para imagen del tema */}
            <View style={styles.imagenPlaceholder}>
              {/* Aquí va la imagen del tema */}
            </View>

            {/* Texto descriptivo */}
            <View style={styles.cardTexto}>
              <Text style={styles.cardTitulo}>El cuerpo humano</Text>
              <Text style={styles.cardDescripcion}>
                Descubre cómo funciona tu cuerpo y la importancia del autocuidado.
              </Text>
            </View>

          </View>

          {/* Barra de progreso decorativa */}
          <View style={styles.barraFondo}>
            <View style={styles.barraRelleno} />
          </View>
        </View>

        {/* LISTA DE SUBTEMAS */}
        <View style={styles.listaTemas}>
          {subtemas.map((subtema) => (
            <TarjetaSubtema
              key={subtema.id}
              titulo={subtema.titulo}
              descripcion={subtema.descripcion}
              icono={subtema.icono}
              bloqueado={subtema.icono === 'candado'}
            />
          ))}
        </View>

        {/* ILUSTRACIÓN INFERIOR DECORATIVA */}
        {/* Reemplaza este View por <Image source={require('...')} style={styles.ilustracionContainer} resizeMode="cover" /> */}
        <View style={styles.ilustracionContainer}>
          {/* Aquí va la ilustración inferior (decoración) */}
        </View>

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
    textAlign: 'center',
  },
  headerEspaciador: {
    width: 36,
  },

  // SCROLL
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },

  // CARD PRINCIPAL
  cardPrincipal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  // Placeholder imagen principal
  // Reemplaza por: <Image source={require('...')} style={styles.imagenPlaceholder} resizeMode="cover" />
  imagenPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    flexShrink: 0,
  },

  cardTexto: {
    flex: 1,
    gap: 4,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardDescripcion: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },

  // Barra de progreso decorativa
  barraFondo: {
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barraRelleno: {
    width: '75%',
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 10,
  },

  // LISTA SUBTEMAS
  listaTemas: {
    gap: 10,
  },

  // TARJETA SUBTEMA
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tarjetaBloqueada: {
    opacity: 0.6,
  },

  // Círculo indicador izquierdo
  circulo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDE9FE',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloBloqueado: {
    backgroundColor: '#F3F4F6',
  },

  // Texto subtema
  contenido: {
    flex: 1,
    gap: 2,
  },
  subtitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  descripcion: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 17,
  },
  textoApagado: {
    color: '#9CA3AF',
  },

  // Íconos de estado
  iconoCheck: {
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
  iconoFlecha: {
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
  iconoCandado: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconoCandadoTexto: {
    fontSize: 18,
  },

  // ILUSTRACIÓN INFERIOR
  // Reemplaza por: <Image source={require('...')} style={styles.ilustracionContainer} resizeMode="cover" />
  ilustracionContainer: {
    width: '100%',
    height: 130,
    backgroundColor: '#D1FAE5',
    marginTop: 4,
  },
});
