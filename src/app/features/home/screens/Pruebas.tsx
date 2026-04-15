import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const temas = [
  {
    id: 1,
    titulo: "El cuerpo humano y la salud",
    descripcion: "Descubre cómo funciona tu cuerpo y la importancia del autocuidado.",
    emoji: "🧑‍⚕️",
    color: "#fee2e2",
    labelColor: "#ef4444",
  },
  {
    id: 2,
    titulo: "Biodiversidad y medio ambiente",
    descripcion: "Explora la riqueza natural y aprende a proteger nuestro planeta.",
    emoji: "🌿",
    color: "#dcfce7",
    labelColor: "#22c55e",
  },
  {
    id: 3,
    titulo: "Propiedades de los materiales",
    descripcion: "Investiga de qué están hechas las cosas y sus transformaciones.",
    emoji: "🔬",
    color: "#fef9c3",
    labelColor: "#eab308",
  },
  {
    id: 4,
    titulo: "El Sistema Solar y el Universo",
    descripcion: "Viaja por las estrellas y descubre los secretos del cosmos.",
    emoji: "🚀",
    color: "#ede9fe",
    labelColor: "#8b5cf6",
  },
  {
    id: 5,
    titulo: "Fuerzas y movimiento",
    descripcion: "Comprende cómo los objetos se mueven y qué los hace cambiar.",
    emoji: "⚡",
    color: "#dbeafe",
    labelColor: "#3b82f6",
  },
];

export default function TemasScreen() {
  const router = useRouter();

  const handleTema = (temaId: number) => {
    router.push({
    pathname: "../../quiz" as any,
    params: { temaId: temaId.toString() },
        });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <Text style={styles.mainTitle}>Saberes y Pensamiento{"\n"}Científico</Text>
        <Text style={styles.mainSubtitle}>
          Explora el fascinante mundo del conocimiento científico en 6° grado.
        </Text>

        {/* Tarjetas de temas */}
        {temas.map((tema) => (
          <View key={tema.id} style={styles.card}>
            <View style={styles.cardLeft}>
              {/* Ícono del robot con atuendo */}
              <View style={[styles.iconCircle, { backgroundColor: tema.color }]}>
                <Text style={styles.iconEmoji}>{tema.emoji}</Text>
              </View>
            </View>
            <View style={styles.cardRight}>
              <Text style={[styles.cardTitle, { color: tema.labelColor }]}>
                {tema.titulo}
              </Text>
              <Text style={styles.cardDesc}>{tema.descripcion}</Text>
              <TouchableOpacity
                style={[styles.startBtn, { backgroundColor: "#5b8cdb" }]}
                onPress={() => handleTema(tema.id)}
              >
                <Text style={styles.startBtnText}>Comenzar</Text>
                <Ionicons name="chevron-forward" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  cardLeft: {
    marginRight: 14,
    justifyContent: "center",
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 34,
  },
  cardRight: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
    lineHeight: 20,
  },
  cardDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
    marginBottom: 10,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
  },
  startBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});
