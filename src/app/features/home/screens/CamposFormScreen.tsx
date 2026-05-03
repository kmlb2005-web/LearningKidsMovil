import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../../../../../assets/images/CamposFormativos/fondo arriba.png")}
          style={styles.bg}
        />

        <View style={styles.headerContent}>
          <Image
            source={require("../../../../../assets/images/CamposFormativos/louzSaludando.png")}
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
    height: 250,
    justifyContent: "flex-end",
    marginTop: 0,
  },

  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 70,
    marginLeft: -15,
  },

  louz: {
    width: 200,
    height: 130,
    marginRight: 12,
    marginTop: 10,
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