import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Fade in y scale del logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Barra de progreso animada
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2800,
      useNativeDriver: false,
    }).start(() => {
      router.replace("/login");
    });
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Fondo con degradado suave simulado */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Logo texto */}
        <Text style={styles.logoText}>LEARNING KIDS</Text>

        {/* Robot / logo imagen */}
        <View style={styles.robotContainer}>
          <Image
            source={require("../../../../../assets/images/logos/logoCuadrado.png")}
            style={styles.robotImage}
            resizeMode="contain"
          />
        </View>

        {/* Texto de carga */}
        <Text style={styles.loadingText}>Preparando tu aventura...</Text>

        {/* Barra de progreso */}
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressWidth },
            ]}
          />
        </View>

        <Text style={styles.almostText}>Ya casi... ✨</Text>
      </Animated.View>

      {/* Texto inferior */}
      <Text style={styles.bottomText}>LEARNING KIDS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f4f8",
    alignItems: "center",
    justifyContent: "center",
  },
  bgTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#d4eef8",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  bgBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "30%",
    backgroundColor: "#f0f7e6",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
    width: "100%",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#4a90d9",
    letterSpacing: 3,
    marginBottom: 30,
    textShadowColor: "rgba(74, 144, 217, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  robotContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: "#4a90d9",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  robotImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  loadingText: {
    fontSize: 18,
    color: "#5a7a8a",
    fontWeight: "500",
    marginBottom: 20,
    textAlign: "center",
  },
  progressBar: {
    width: width * 0.6,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#4a90d9",
    // Simulación del degradado azul → amarillo con color sólido
  },
  almostText: {
    fontSize: 13,
    color: "#7a9ab0",
  },
  bottomText: {
    position: "absolute",
    bottom: 30,
    fontSize: 11,
    color: "#aabcc8",
    letterSpacing: 2,
    fontWeight: "600",
  },
});
