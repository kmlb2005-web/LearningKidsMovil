import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TemasScreen() {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.back}>{'<'}</Text>
        <Text style={styles.title}>El cuerpo humano</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* CARD PRINCIPAL */}
        <View style={styles.mainCard}>
          
          {/* Placeholder imagen */}
          <View style={styles.imagePlaceholder} />

          {/* Texto */}
          <View style={styles.textContainer}>
            <Text style={styles.mainTitle}>El cuerpo humano</Text>
            <Text style={styles.description}>
              Descubre cómo funciona tu cuerpo y la importancia del autocuidado.
            </Text>
          </View>
        </View>

        {/* LISTA DE TEMAS */}
        <View style={styles.list}>
          {temas.map((tema, index) => (
            <TouchableOpacity key={index} style={styles.item}>
              
              {/* Círculo izquierdo */}
              <View style={styles.circle} />

              {/* Texto */}
              <View style={styles.itemText}>
                <Text style={styles.itemTitle}>{tema.titulo}</Text>
                <Text style={styles.itemDesc}>{tema.descripcion}</Text>
              </View>

              {/* Flecha */}
              <View style={styles.iconRight}>
                <Text style={styles.arrow}>{'>'}</Text>
              </View>

            </TouchableOpacity>
          ))}
        </View>

        {/* Footer decorativo */}
        <View style={styles.footer} />

      </ScrollView>
    </SafeAreaView>
  );
}

const temas = [
  {
    titulo: 'Los órganos y sus funciones',
    descripcion: 'Conoce los órganos principales y qué hacen.',
  },
  {
    titulo: 'Sistemas del cuerpo',
    descripcion: 'Aprende cómo trabajan juntos los sistemas.',
  },
  {
    titulo: 'Alimentación y nutrición',
    descripcion: 'Descubre cómo los alimentos nos dan energía.',
  },
  {
    titulo: 'Hábitos saludables',
    descripcion: 'Aprende hábitos que cuidan tu cuerpo y mente.',
  },
  {
    titulo: 'Prevención de enfermedades',
    descripcion: 'Conoce cómo prevenir y cuidar tu salud.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },

  back: {
    fontSize: 18,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  headerRight: {
    width: 24,
  },

  mainCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 16,
  },

  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  description: {
    fontSize: 13,
    color: '#666',
  },

  list: {
    paddingHorizontal: 16,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },

  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    marginRight: 12,
  },

  itemText: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  itemDesc: {
    fontSize: 12,
    color: '#666',
  },

  iconRight: {
    marginLeft: 8,
  },

  arrow: {
    fontSize: 16,
    color: '#888',
  },

  footer: {
    height: 120,
    marginTop: 20,
    marginBottom: 20,
  },
});