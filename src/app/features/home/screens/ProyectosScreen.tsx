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
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// 🖼️ Imágenes locales del archivo 1 — ajusta las rutas a tu proyecto
const imagenesLocales = [
  require('../../../../../assets/images_2/doctor.png'),
  require('../../../../../assets/images_2/hoja.png'),
  require('../../../../../assets/images_2/microscopio.png'),
  require('../../../../../assets/images_2/cohete.png'),
  require('../../../../../assets/images_2/rayo.png'),
];

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
        setProyectos(data.filter((p) => p.idCampo === Number(idCampo)));
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
      <View style={[styles.header, { paddingTop: insets.top + 12 }]} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainTitle}>{config.title}</Text>
        <Text style={styles.mainSubtitle}>
          Explora los proyectos disponibles en este campo formativo.
        </Text>

        {proyectos.map((item, index) => (
          <View key={item.idProyecto} style={styles.card}>
            {/* 🖼️ Imagen local asignada por índice */}
            <Image
              source={imagenesLocales[index % imagenesLocales.length]}
              style={styles.imagenProyecto}
              resizeMode="contain"
            />

            <View style={styles.cardRight}>
              <Text style={[styles.cardTitle, { color: config.labelColor }]}>
                {item.nombre}
              </Text>
              <Text style={styles.cardDesc}>{item.descripcion}</Text>

              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => handleTema(item.idProyecto)}
              >
                <Text style={styles.startBtnText}>Comenzar</Text>
                <Ionicons name="chevron-forward" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {proyectos.length === 0 && (
          <Text style={{ textAlign: "center", color: "#64748b" }}>
            No hay proyectos disponibles
          </Text>
        )}

        {/* 🖼️ Imagen decorativa inferior del archivo 1 */}
        <Image
          source={require('../../../../../assets/images_2/fondoo.png')}
          style={styles.fondoInferior}
          resizeMode="cover"
        />
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
    paddingBottom: 40,
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
    alignItems: "center",
    elevation: 4,
    gap: 14,
  },
  // 🖼️ Estilo de la imagen (equivalente a imagenPlaceholder del archivo 1)
  imagenProyecto: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F3F4F6",
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
  fondoInferior: {
    width: "100%",
    height: 130,
    marginTop: 40,
    marginBottom: 20,
  },
});