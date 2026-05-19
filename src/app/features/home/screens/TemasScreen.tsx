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
import { fetchWithHostFallback } from "../../../../shared/services/apiHttp";

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
  const { idProyecto, idCampo, campoNombre } = useLocalSearchParams();
  const cardPressAnimations = React.useRef<Record<string, Animated.Value>>({}).current;

  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const res = await fetchWithHostFallback("/api/temas");
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

  if (loading) {
    return (
      <ImageBackground
        source={require("../../../../../assets/images/Splash/fondo.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const proyectoNombre = temas[0]?.proyecto?.nombre || "Proyecto";
  const proyectoDesc = temas[0]?.proyecto?.descripcion || "";

  const imagenesLocales = [
    require("../../../../../assets/images_3/uno.png"),
    require("../../../../../assets/images_3/dos.png"),
    require("../../../../../assets/images_3/tres.png"),
    require("../../../../../assets/images_3/cuatro.png"),
    require("../../../../../assets/images_3/cinco.png"),
  ];

  const onPressTema = (id: number) => {
    console.log("TEMA PRESIONADO");
    console.log("idTema enviado:", id);

    router.push({
      pathname: "/(tabs)/pruebas",
      params: {
        idTema: id.toString(),
        idProyecto: String(idProyecto ?? ""),
        idCampo: String(idCampo ?? ""),
        campoNombre: String(campoNombre ?? ""),
      },
    });
  };

  const handleBackNavigation = () => {
    const campoIdValue = String(idCampo ?? "").trim();

    if (campoIdValue.length > 0) {
      router.replace({
        pathname: "/(tabs)/proyectos",
        params: {
          idCampo: campoIdValue,
          campoNombre: String(campoNombre ?? ""),
        },
      });
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/campos");
  };

  const getCardPressAnimation = (key: string) => {
    if (!cardPressAnimations[key]) {
      cardPressAnimations[key] = new Animated.Value(0);
    }
    return cardPressAnimations[key];
  };

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

  const handleCardPress = (key: string, onComplete: () => void) => {
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
    ]).start(onComplete);
  };

  const getAnimatedStyle = (key: string) => ({
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

  const onPressBack = () => {
    handleCardPress("temas-back", handleBackNavigation);
  };
  console.log(
    "TEMAS API:",
    temas.map((x) => ({
      idTema: x.idTema,
      nombre: x.nombre,
    }))
  );

  return (
    <ImageBackground
      source={require("../../../../../assets/images/Splash/fondo.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Animated.View style={getAnimatedStyle("temas-back")}>
            <TouchableOpacity
              style={styles.btnBack}
              activeOpacity={1}
              onPressIn={() => handleCardPressIn("temas-back")}
              onPressOut={() => handleCardPressOut("temas-back")}
              onPress={onPressBack}
            >
              <Text style={styles.btnBackText}>‹</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>✨ {proyectoNombre} ✨</Text>
          </View>

          <View style={{ width: 36 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* CARD PRINCIPAL (VISUAL DEL PRIMER CÓDIGO) */}
        <View style={styles.mainCard}>
          <Image
            source={require("../../../../../assets/images_3/doctor.png")}
            style={styles.mainImage}
            resizeMode="cover"
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.mainTitle}>{proyectoNombre}</Text>
            <Text style={styles.mainDesc}>{proyectoDesc}</Text>
          </View>
        </View>

        {/* LISTA DE TEMAS (FUNCIONALIDAD DEL SEGUNDO + IMÁGENES) */}
        <View style={styles.list}>
          {temas.map((item, index) => (
            <Animated.View
              key={item.idTema}
              style={[
                styles.cardAnimatedWrap,
                getAnimatedStyle(`tema-${item.idTema}`),
              ]}
            >
              <TouchableOpacity
                style={styles.item}
                activeOpacity={1}
                onPressIn={() => handleCardPressIn(`tema-${item.idTema}`)}
                onPressOut={() => handleCardPressOut(`tema-${item.idTema}`)}
                onPress={() =>
                  handleCardPress(`tema-${item.idTema}`, () => onPressTema(item.idTema))
                }
              >
                <Image
                  source={imagenesLocales[index] || imagenesLocales[0]}
                  style={styles.circle}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.nombre}</Text>
                  <Text style={styles.itemDesc}>{item.descripcion}</Text>
                </View>

                <View style={styles.arrowPill}>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

/* ========= STYLES ========= */
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
    lineHeight: 28,
  },

  headerTitle: {
    flex: 1,
    fontSize: 19,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    letterSpacing: 0.2,
    flexShrink: 1,
  },

  headerTitleWrap: {
    flex: 1,
    marginHorizontal: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 56,
    borderRadius: 20,
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

  mainCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    elevation: 4,
    gap: 12,
  },

  mainImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },

  mainTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1e293b",
  },

  mainDesc: {
    fontSize: 13,
    color: "#475569",
    marginTop: 3,
  },

  list: {
    paddingHorizontal: 0,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 4,
  },

  cardAnimatedWrap: {
    marginBottom: 0,
  },

  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  itemTitle: {
    fontWeight: "800",
    color: "#1e293b",
  },

  itemDesc: {
    fontSize: 12,
    color: "#64748b",
  },

  arrowPill: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },

  arrow: {
    fontSize: 20,
    color: "#2563eb",
    lineHeight: 22,
  },
});