import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

type Field = {
  id: string;
  title: string;
  progress: number;
  color: string;
};

type ApiField = {
  idCampo: number;
  nombre: string;
};

export default function CamposFormScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = ["#3b82f6", "#8b5cf6", "#f97316", "#22c55e"];

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await fetch(
          "http://192.168.1.72:5125/api/camposFormativos"
        );
        const data: ApiField[] = await res.json();

        const mapped: Field[] = data.map((item, index) => ({
          id: item.idCampo.toString(),
          title: item.nombre.trim(),
          progress: Math.floor(Math.random() * 100), // opcional
          color: colors[index % colors.length],
        }));

        setFields(mapped);
      } catch (error) {
        console.error("Error fetching fields:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handlePress = (id: string) => {
    router.push({
    pathname: "/(tabs)/proyectos",
    params: { idCampo: id },
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
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Image
          source={{ uri: "https://via.placeholder.com/120" }}
          style={styles.headerImg}
        />

        <Text style={styles.title}>¡Hola, Louz! 👋</Text>
        <Text style={styles.subtitle}>
          ¿Qué quieres aprender hoy?
        </Text>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {fields.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handlePress(item.id)}
          >
            <Image
              source={{ uri: "https://via.placeholder.com/80" }}
              style={styles.icon}
            />

            <Text style={styles.cardTitle}>{item.title}</Text>

            <View style={styles.progressContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${item.progress}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {item.progress}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f3",
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    paddingVertical: 20,
  },

  headerImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
  },

  subtitle: {
    color: "#64748b",
    marginTop: 4,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 100,
  },

  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },

  cardTitle: {
    textAlign: "center",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 10,
  },

  progressContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: 10,
  },

  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748b",
  },
});