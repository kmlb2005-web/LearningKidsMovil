import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* IMÁGENES */
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
  1: { emoji: "🔬", color: "#dbeafe", labelColor: "#3b82f6" },
  4: { emoji: "📚", color: "#fef3c7", labelColor: "#f59e0b" },
  5: { emoji: "🌱", color: "#dcfce7", labelColor: "#22c55e" },
  6: { emoji: "👥", color: "#ede9fe", labelColor: "#8b5cf6" },
};

const fallbackConfig = { emoji: "✨", color: "#e2e8f0", labelColor: "#475569" };

const getCampoConfig = (idCampoValue: unknown, campoNombreValue: unknown) => {
  if (typeof campoNombreValue === "string") {
    const nombre = campoNombreValue.toLowerCase();

    if (nombre.includes("cientifico") || nombre.includes("científico")) {
      return campoConfig[1];
    }

    if (nombre.includes("lenguaje")) {
      return campoConfig[4];
    }

    if (nombre.includes("etica") || nombre.includes("ética") || nombre.includes("sociedad")) {
      return campoConfig[5];
    }

    if (nombre.includes("humano") || nombre.includes("comunitario")) {
      return campoConfig[6];
    }
  }

  const idNum = Number(idCampoValue);
  return campoConfig[idNum] || fallbackConfig;
};

export default function ProyectosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { idCampo, campoNombre } = useLocalSearchParams();
  const pressAnimations = React.useRef<Record<string, Animated.Value>>({}).current;

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  const config = getCampoConfig(idCampo, campoNombre);
  const displayCampoNombre =
    typeof campoNombre === "string" && campoNombre.trim().length > 0
      ? campoNombre
      : "Campo formativo";

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
      params: {
        idProyecto: id.toString(),
        idCampo: String(idCampo ?? ""),
        campoNombre: String(campoNombre ?? ""),
      },
    });
  };

  const handleBackNavigation = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/campos");
  };

  const getPressAnimation = (key: string) => {
    if (!pressAnimations[key]) {
      pressAnimations[key] = new Animated.Value(0);
    }
    return pressAnimations[key];
  };

  const getPressStyle = (key: string) => ({
    transform: [
      {
        translateY: getPressAnimation(key).interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
      {
        scale: getPressAnimation(key).interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.08],
        }),
      },
      {
        rotate: getPressAnimation(key).interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "-2deg"],
        }),
      },
    ],
  });

  const animatePressIn = (key: string) => {
    Animated.timing(getPressAnimation(key), {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const animatePressOut = (key: string) => {
    Animated.spring(getPressAnimation(key), {
      toValue: 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  };

  const animatePress = (key: string, onComplete: () => void) => {
    const animation = getPressAnimation(key);

    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
        speed: 16,
        bounciness: 11,
      }),
    ]).start(onComplete);
  };

  if (loading) {
    return (
      <ImageBackground
        source={require('../../../../../assets/images/Splash/fondo.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('../../../../../assets/images/Splash/fondo.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Animated.View style={getPressStyle("proyectos-back-button")}>
            <TouchableOpacity
              style={styles.btnBack}
              activeOpacity={1}
              onPressIn={() => animatePressIn("proyectos-back-button")}
              onPressOut={() => animatePressOut("proyectos-back-button")}
              onPress={() => animatePress("proyectos-back-button", handleBackNavigation)}
            >
              <Text style={styles.btnBackText}>‹</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>
              {`${config.emoji} ${displayCampoNombre} ${config.emoji}`}
            </Text>
          </View>

          <View style={{ width: 36 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* ❌ ELIMINADO: mainTitle */}

          {/* SUBTÍTULO */}
          <Text style={styles.mainSubtitle}>
            Explora los proyectos disponibles en este campo formativo.
          </Text>

          {proyectos.map((item, index) => (
            <View key={item.idProyecto} style={styles.card}>
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

                <Animated.View style={[{ alignSelf: "flex-start" }, getPressStyle(`proyecto-${item.idProyecto}`)]}>
                  <TouchableOpacity
                    style={styles.startBtn}
                    activeOpacity={1}
                    onPressIn={() => animatePressIn(`proyecto-${item.idProyecto}`)}
                    onPressOut={() => animatePressOut(`proyecto-${item.idProyecto}`)}
                    onPress={() =>
                      animatePress(`proyecto-${item.idProyecto}`, () => handleTema(item.idProyecto))
                    }
                  >
                    <Text style={styles.startBtnText}>Comenzar</Text>
                    <Ionicons name="chevron-forward" size={14} color="#fff" />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          ))}

          {proyectos.length === 0 && (
            <Text style={{ textAlign: "center", color: "#64748b" }}>
              No hay proyectos disponibles
            </Text>
          )}

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  btnBack: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },

  btnBackText: {
    fontSize: 24,
    color: "#374151",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    letterSpacing: 0.2,
    flexShrink: 1,
  },

  headerTitleWrap: {
    flex: 1,
    marginHorizontal: 6,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    justifyContent: "center",
    elevation: 2,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  mainSubtitle: {
    fontSize: 14,
    color: "#242525",
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

});