import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLocalSearchParams, useRouter } from "expo-router";

type Tema = {
  idTema: number;
  nombre: string;
  descripcion: string;
  idProyecto: number;
  proyecto: {
    nombre: string;
    descripcion: string;
  };
};

export default function TemasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { idProyecto } = useLocalSearchParams();

  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const res = await fetch(
          "http://192.168.1.72:5125/api/temas"
        );
        const data: Tema[] = await res.json();

        const filtrados = data.filter(
          (t) => t.idProyecto === Number(idProyecto)
        );

        setTemas(filtrados);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemas();
  }, [idProyecto]);

  const onBack = () => router.back();

  const onPressTema = (id: number) => {
    router.push({
        pathname: "/features/home/screens/PruebasScreen",
        params: { idTema: id.toString() },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  const proyectoNombre = temas[0]?.proyecto?.nombre || "Proyecto";
  const proyectoDesc = temas[0]?.proyecto?.descripcion || "";

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {proyectoNombre}
        </Text>

        <View style={styles.points}>
          <Text style={styles.pointsText}>⭐ 120</Text>
        </View>
      </View>

      {/* INFO CARD */}
      <View style={styles.infoCard}>
        <Image
          source={{ uri: "https://via.placeholder.com/80" }}
          style={styles.avatar}
        />

        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>
            {proyectoNombre}
          </Text>

          <Text style={styles.infoDesc}>
            {proyectoDesc}
          </Text>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: "60%" }]} />
          </View>
        </View>
      </View>

      {/* TEMAS */}
      <ScrollView contentContainerStyle={styles.list}>
        {temas.map((item, idx) => {
          const status =
            idx === 0 ? "active" : "locked"; // simple lógica

          return (
            <TouchableOpacity
              key={item.idTema}
              activeOpacity={status === "locked" ? 1 : 0.7}
              onPress={() =>
                status !== "locked" && onPressTema(item.idTema)
              }
              style={[
                styles.temaCard,
                status === "active" && styles.activeCard,
                status === "locked" && styles.lockedCard,
              ]}
            >
              {/* NUMERO */}
              <View
                style={[
                  styles.circle,
                  status === "active" && styles.circleActive,
                ]}
              >
                <Text style={styles.circleText}>
                  {idx + 1}
                </Text>
              </View>

              {/* TEXTO */}
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.temaTitle,
                    status === "locked" && styles.textMuted,
                  ]}
                >
                  {item.nombre}
                </Text>

                <Text
                  style={[
                    styles.temaDesc,
                    status === "locked" && styles.textMuted,
                  ]}
                >
                  {item.descripcion}
                </Text>
              </View>

              {/* ICONO */}
              {status === "active" && (
                <Text style={styles.arrow}>›</Text>
              )}
              {status === "locked" && (
                <Text style={styles.lock}>🔒</Text>
              )}
            </TouchableOpacity>
          );
        })}

        {temas.length === 0 && (
          <Text style={{ textAlign: "center", color: "#64748b" }}>
            No hay temas disponibles
          </Text>
        )}
      </ScrollView>

      <Image
        source={{ uri: "https://via.placeholder.com/400x120" }}
        style={styles.footerImg}
      />
    </SafeAreaView>
  );
}

/* ========= STYLES ========= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef2f3" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  back: { fontSize: 20 },

  headerTitle: {
    fontWeight: "700",
    fontSize: 16,
  },

  points: {
    backgroundColor: "#facc15",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  pointsText: { fontWeight: "700" },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 20,
  },

  avatar: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 12,
  },

  infoTitle: { fontWeight: "700" },
  infoDesc: { fontSize: 12, color: "#64748b" },

  progressContainer: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    marginTop: 6,
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 10,
  },

  list: { padding: 16, paddingBottom: 110 },

  temaCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },

  activeCard: {
    borderWidth: 2,
    borderColor: "#22c55e",
  },

  lockedCard: {
    opacity: 0.5,
  },

  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  circleActive: {
    backgroundColor: "#60a5fa",
  },

  circleText: {
    fontWeight: "800",
  },

  temaTitle: {
    fontWeight: "700",
    fontSize: 13,
  },

  temaDesc: {
    fontSize: 12,
    color: "#64748b",
  },

  textMuted: {
    color: "#94a3b8",
  },

  arrow: {
    fontSize: 22,
  },

  lock: {
    fontSize: 16,
  },

  footerImg: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 110,
  },
});