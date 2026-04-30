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

type Prueba = {
  idPrueba: number;
  titulo: string;
  idTema: number;
  tema: {
    nombre: string;
  };
  preguntas: any[];
};

export default function PruebasScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { idTema } = useLocalSearchParams();

  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPruebas = async () => {
      try {
        const res = await fetch(
          "http://192.168.1.72:5125/api/pruebas"
        );
        const data: Prueba[] = await res.json();

        const filtradas = data.filter(
          (p) => p.idTema === Number(idTema)
        );

        setPruebas(filtradas);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPruebas();
  }, [idTema]);

  const onBack = () => router.back();

  const onStart = (id: number) => {
    router.push({
      pathname: "/(tabs)/formPruebas",
      params: { idPrueba: id.toString() },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  const temaNombre = pruebas[0]?.tema?.nombre || "Tema";

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {temaNombre}
        </Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {pruebas.map((item, index) => (
          <View key={item.idPrueba} style={styles.card}>
            <Image
              source={{ uri: "https://via.placeholder.com/60" }}
              style={styles.icon}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>
                {item.titulo}
              </Text>

              <Text style={styles.cardDesc}>
                {index === 0
                  ? "Practica lo que aprendiste en este tema."
                  : "Pon a prueba todo lo que aprendiste."}
              </Text>

              <Text style={styles.stats}>
                Preguntas: {item.preguntas.length}
              </Text>
            </View>

            <TouchableOpacity
              style={
                index === 0
                  ? styles.btnGreen
                  : styles.btnBlue
              }
              onPress={() => onStart(item.idPrueba)}
            >
              <Text style={styles.btnText}>Iniciar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {pruebas.length === 0 && (
          <Text style={{ textAlign: "center", color: "#64748b" }}>
            No hay pruebas disponibles
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ========= STYLES ========= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f3",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  back: {
    fontSize: 20,
    color: "#1e293b",
  },

  headerTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#1e293b",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },

  icon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },

  cardTitle: {
    fontWeight: "700",
    fontSize: 14,
    color: "#1e293b",
  },

  cardDesc: {
    fontSize: 12,
    color: "#64748b",
  },

  stats: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 4,
  },

  btnGreen: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  btnBlue: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});