import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

/* ========= TYPES ========= */
type Field = {
  id: string;
  title: string;
  progress: number;
  image: any;
  color: string;
};

type ApiField = {
  idCampo: number;
  nombre: string;
};

export default function CamposFormScreen() {
  const router = useRouter();
  const cardPressAnimations = React.useRef<Record<string, Animated.Value>>({}).current;
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);

  /* 🔥 MAPEO POR NOMBRE */
  const getAsset = (name: string) => {
    const n = name.toLowerCase();

    if (n.includes("cientifico") || n.includes("científico"))
      return {
        image: require("../../../../../assets/images/CamposFormativos/SaberesyPensamientoCientifico.png"),
        color: "#8b5cf6",
      };

    if (n.includes("lenguaje"))
      return {
        image: require("../../../../../assets/images/CamposFormativos/Lenguajes.png"),
        color: "#f59e0b",
      };

    if (n.includes("ética") || n.includes("etica"))
      return {
        image: require("../../../../../assets/images/CamposFormativos/Etica,NaturalezaySociedades.png"),
        color: "#22c55e",
      };

    if (n.includes("humano"))
      return {
        image: require("../../../../../assets/images/CamposFormativos/DeloHumanoyloComunitario.png"),
        color: "#3b82f6",
      };

    return {
      image: null,
      color: "#8b5cf6",
    };
  };

  /* ========= FETCH ========= */
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await fetch(
          "http://192.168.1.72:5125/api/camposFormativos"
        );
        const data: ApiField[] = await res.json();

        const mapped: Field[] = data.map((item) => {
          const asset = getAsset(item.nombre);

          return {
            id: item.idCampo.toString(),
            title: item.nombre.trim(),
            progress: Math.floor(Math.random() * 100),
            image: asset.image,
            color: asset.color,
          };
        });

        setFields(mapped);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handlePress = (id: string, title: string) => {
    const normalizedTitle = title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    const isUnavailableCampo =
      normalizedTitle.includes("lenguajes") ||
      normalizedTitle.includes("etica, naturaleza y sociedades") ||
      normalizedTitle.includes("etica, naturaleza y sociedad") ||
      normalizedTitle.includes("de lo humano y lo comunitario");

    if (isUnavailableCampo) {
      Alert.alert("Campo informativo no disponible");
      return;
    }

    router.push({
      pathname: "/(tabs)/proyectos",
      params: { idCampo: id, campoNombre: title },
    });
  };

  const getCardPressAnimation = (key: string) => {
    if (!cardPressAnimations[key]) {
      cardPressAnimations[key] = new Animated.Value(0);
    }
    return cardPressAnimations[key];
  };

  const getCardPressStyle = (key: string) => ({
    transform: [
      {
        translateY: getCardPressAnimation(key).interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
      {
        scale: getCardPressAnimation(key).interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.08],
        }),
      },
      {
        rotate: getCardPressAnimation(key).interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "-2deg"],
        }),
      },
    ],
  });

  const handleCardPressIn = (key: string) => {
    Animated.timing(getCardPressAnimation(key), {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  const handleCardPressOut = (key: string) => {
    Animated.spring(getCardPressAnimation(key), {
      toValue: 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  };

  const handleCardPress = (id: string, title: string) => {
    const key = `campo-${id}`;
    const animation = getCardPressAnimation(key);

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
    ]).start(() => handlePress(id, title));
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View pointerEvents="none" style={styles.headerCloudLayer}>
          <Image
            source={require("../../../../../assets/images/HomeScreen/Nube.png")}
            style={[styles.headerCloud, { top: 10, left: 18, width: 78, height: 44, opacity: 0.45 }]}
          />
          <Image
            source={require("../../../../../assets/images/HomeScreen/Nube.png")}
            style={[styles.headerCloud, { top: 16, left: 110, width: 60, height: 34, opacity: 0.38 }]}
          />
          <Image
            source={require("../../../../../assets/images/HomeScreen/Nube.png")}
            style={[styles.headerCloud, { top: 12, right: 20, width: 72, height: 40, opacity: 0.42 }]}
          />
          <Image
            source={require("../../../../../assets/images/HomeScreen/Nube.png")}
            style={[styles.headerCloud, { top: 78, right: 118, width: 56, height: 32, opacity: 0.32 }]}
          />
          <Image
            source={require("../../../../../assets/images/HomeScreen/Nube.png")}
            style={[styles.headerCloud, { bottom: 26, left: 26, width: 68, height: 38, opacity: 0.36 }]}
          />
          <Image
            source={require("../../../../../assets/images/HomeScreen/Nube.png")}
            style={[styles.headerCloud, { bottom: 20, right: 28, width: 62, height: 35, opacity: 0.34 }]}
          />
        </View>

        <View style={styles.headerContent}>
          <Image
            source={require("../../../../../assets/images/HomeScreen/Louz1.png")}
            style={styles.louz}
          />

          <View>
            <Text style={styles.title}>¡Hola, soy Louz! 👋</Text>
            <Text style={styles.subtitle}>
              ¿Qué quieres aprender hoy?
            </Text>
          </View>
        </View>
      </View>

      {/* GRID */}
      <View style={styles.grid}>
        {fields.map((item) => (
          <Animated.View
            key={item.id}
            style={[styles.cardAnimatedWrap, getCardPressStyle(`campo-${item.id}`)]}
          >
            <TouchableOpacity
              style={[styles.card, { backgroundColor: item.color + "30" }]}
              activeOpacity={1}
              onPressIn={() => handleCardPressIn(`campo-${item.id}`)}
              onPressOut={() => handleCardPressOut(`campo-${item.id}`)}
              onPress={() => handleCardPress(item.id, item.title)}
            >
              {item.image && (
                <Image source={item.image} style={styles.cardImage} />
              )}
              <View style={styles.cardOverlay}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {fields.length === 0 && (
          <Text style={styles.emptyStateText}>
            No se encontraron campos formativos. Verifica que el backend este activo.
          </Text>
        )}
      </View>
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
    backgroundColor: "#EAF6FF",
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    height: 250,
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 45,
    marginLeft: -15,
    zIndex: 2,
  },

  headerCloudLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  headerCloud: {
    position: "absolute",
    resizeMode: "contain",
  },

  louz: {
    width: 200,
    height: 150,
    marginRight: 24,
    marginTop: 0,
    marginLeft: -20,
    resizeMode: "contain",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    marginLeft: -50,
  },

  subtitle: {
    color: "#64748b",
    marginTop: 4,
    fontSize: 16,
    marginLeft: -50,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
  },

  /* 🔥 CARD */
  cardAnimatedWrap: {
    width: "48%",
    marginBottom: 16,
  },

  card: {
    width: "100%",
    borderRadius: 22,
    overflow: "hidden",
    height: 220,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },

  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#00000040",
    alignItems: "center",
  },

  cardTitle: {
    fontWeight: "700",
    textAlign: "center",
    fontSize: 13,
    color: "#ffffff",
  },

  emptyStateText: {
    width: "100%",
    textAlign: "center",
    marginTop: 12,
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },
});