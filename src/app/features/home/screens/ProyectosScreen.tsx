import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Proyecto = {
  idProyecto: number;
  nombre: string;
  descripcion: string;
  idCampo: number;
};

const campoConfig: any = {
  1: { emoji: "🔬", color: "#dbeafe", labelColor: "#3b82f6", title: "Científico" },
  4: { emoji: "📚", color: "#fef3c7", labelColor: "#f59e0b", title: "Lenguajes" },
  5: { emoji: "🌱", color: "#dcfce7", labelColor: "#22c55e", title: "Ética y Sociedad" },
  6: { emoji: "👥", color: "#ede9fe", labelColor: "#8b5cf6", title: "Comunitario" },
};

export default function ProyectosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { idCampo } = useLocalSearchParams();

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  const config = campoConfig[idCampo as string] || campoConfig[1];

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const res = await fetch("http://192.168.1.72:5125/api/proyectos");
        const data: Proyecto[] = await res.json();

        const filtrados = data.filter(
          (p) => p.idCampo === Number(idCampo)
        );

        setProyectos(filtrados);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProyectos();
  }, [idCampo]);

  const handleTema = (id: number) => {
    router.push({
        pathname: "/(tabs)/temas",
        params: { idProyecto: id.toString() },
    });
};

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* TITULO DINÁMICO */}
        <Text style={styles.mainTitle}>
          {config.title}
        </Text>

        <Text style={styles.mainSubtitle}>
          Explora los proyectos disponibles en este campo formativo.
        </Text>

        {/* PROYECTOS */}
        {proyectos.map((item) => (
          <View key={item.idProyecto} style={styles.card}>
            <View style={styles.cardLeft}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: config.color },
                ]}
              >
                <Text style={styles.iconEmoji}>
                  {config.emoji}
                </Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: config.labelColor },
                ]}
              >
                {item.nombre}
              </Text>

              <Text style={styles.cardDesc}>
                {item.descripcion}
              </Text>

              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => handleTema(item.idProyecto)}
              >
                <Text style={styles.startBtnText}>
                  Comenzar
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* SIN DATOS */}
        {proyectos.length === 0 && (
          <Text style={{ textAlign: "center", color: "#64748b" }}>
            No hay proyectos disponibles
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
  },
  header: {
    padding: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8,
  },
  mainSubtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
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
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 10,
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#5b8cdb",
    gap: 4,
  },
  startBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});