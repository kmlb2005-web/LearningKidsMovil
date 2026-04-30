import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      {/* Fondo suave */}
      <View style={styles.bgDecor} />

      {/* Contenido principal */}
      <View style={[styles.content, { paddingTop: insets.top + 36 }]}>
        {/* Título */}
        <Text style={styles.title}>¿Qué decides hacer{"\n"}hoy?</Text>
        <Text style={styles.subtitle}>¡Tu amigo Louz te espera!</Text>

        {/* Botón Chat */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push("/(tabs)/chatScreen")}
          activeOpacity={0.85}
          
        >
          <View style={styles.circleBtn}>
            <Image
              source={require("../../../../../assets/images/logos/logoCuadrado.png")}
              style={styles.circleImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.pillLabel}>
            <Text style={styles.pillText}>Chat</Text>
          </View>
        </TouchableOpacity>

        {/* Botón Pruebas */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push("/(tabs)/campos")}
          activeOpacity={0.85}
        >
          <View style={[styles.circleBtn, styles.circleBtnAlt]}>
            <Text style={styles.clipboardEmoji}>📋</Text>
          </View>
          <View style={[styles.pillLabel, styles.pillLabelAlt]}>
            <Text style={[styles.pillText, styles.pillTextAlt]}>Pruebas</Text>
          </View>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5f0",
  },
  bgDecor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "#d4eef8",
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1e293b",
    textAlign: "center",
    lineHeight: 38,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 36,
    fontStyle: "italic",
  },
  optionCard: {
    alignItems: "center",
    marginBottom: 28,
  },
  circleBtn: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#c8e6fa",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5b8cdb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: "rgba(91,140,219,0.15)",
  },
  circleBtnAlt: {
    backgroundColor: "#fef3c7",
    shadowColor: "#f59e0b",
    borderColor: "rgba(245,158,11,0.15)",
  },
  circleImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  clipboardEmoji: {
    fontSize: 70,
  },
  pillLabel: {
    marginTop: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 28,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  pillLabelAlt: {
    backgroundColor: "#fff",
  },
  pillText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3b82f6",
  },
  pillTextAlt: {
    color: "#f59e0b",
  },
});