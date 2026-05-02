import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const robotY = useRef(new Animated.Value(0)).current;

  const [msg, setMsg] = useState("Preparando tu aventura...");

  useEffect(() => {
    // Entrada
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // 🤖 Animación del robot (idle)
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotY, {
          toValue: -8,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(robotY, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // ⏱️ Cambios de texto
    setTimeout(() => setMsg("Cargando contenido..."), 2000);
    setTimeout(() => setMsg("Casi listo... 🚀"), 4500);

    // 📊 Barra (7 segundos)
    Animated.timing(progress, {
      toValue: 1,
      duration: 20000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      router.replace("/login");
    });
  }, []);

  const widthAnim = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Fondo */}
      <Image source={require("../../../../../assets/images/Splash/fondo.png")} style={styles.bg} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fade, transform: [{ scale }] },
        ]}
      >
        {/* Título */}
        <Image
          source={require("../../../../../assets/images/Splash/titulo.png")}
          style={styles.title}
          resizeMode="contain"
        />

        {/* Círculo + Robot */}
        <View style={styles.circleContainer}>
          <Image
            source={require("../../../../../assets/images/Splash/circulo.png")}
            style={styles.circle}
          />

          <Animated.Image
            source={require("../../../../../assets/images/Splash/louz.png")}
            style={[
              styles.robot,
              { transform: [{ translateY: robotY }] },
            ]}
          />
        </View>

        {/* Texto dinámico */}
        <Text style={styles.text}>{msg}</Text>

        {/* Barra */}
        <View style={styles.bar}>
          <Animated.View style={[styles.fill, { width: widthAnim }]} />
        </View>

        <Text style={styles.subText}>¡Ya casi! ✨</Text>
      </Animated.View>

      {/* Nubes */}
      <Image
        source={require("../../../../../assets/images/Splash/nubes.png")}
        style={styles.clouds}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f4f8",
    justifyContent: "center",
    alignItems: "center",
  },

  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  content: {
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },

  title: {
    width: 460,
    height: 250,
    marginBottom: -8,
  },

  circleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    marginTop: -24,
  },

  circle: {
    width: 280,
    height: 280,
    position: "absolute",
  },

  robot: {
    width: 220,
    height: 220,
  },

  text: {
    fontSize: 18,
    color: "#2d6cdf",
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },

  bar: {
    width: width * 0.7,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 10,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#4a90d9",
  },

  subText: {
    marginTop: 10,
    color: "#6c8aa0",
  },

  clouds: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 130,
  },
});