import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchWithHostFallback } from "../../../../shared/services/apiHttp";
import { getAuthenticatedUser } from "../../../../shared/utils/authSession";

type Prueba = {
  idPrueba: number;
  titulo: string;
  idTema: number;
  creadoPor: number;

  Tema?: {
    idTema: number;
    nombre: string;
    descripcion: string;
    idProyecto: number;
  } | null;

  Preguntas: Array<{
    idPregunta: number;
    texto: string;
  }>;
};

type ResultadoApi = {
  idResultado: number;
  idAlumno: number;
  idPrueba: number;
  calificacion: number;
  fecha: string;
  tituloPrueba: string;
};

const extractCalificacion = (payload: unknown): number | null => {
  if (!payload) return null;

  if (Array.isArray(payload) && payload.length > 0) {
    const latest = [...payload].sort((a, b) => {
      const aResult = a as { idResultado?: number; fecha?: string };
      const bResult = b as { idResultado?: number; fecha?: string };

      const timeA = aResult.fecha ? new Date(aResult.fecha).getTime() : 0;
      const timeB = bResult.fecha ? new Date(bResult.fecha).getTime() : 0;

      if (timeA !== timeB) {
        return timeB - timeA;
      }

      return (bResult.idResultado ?? 0) - (aResult.idResultado ?? 0);
    })[0] as { calificacion?: number | string };

    const value = Number(latest?.calificacion);
    return Number.isFinite(value) ? value : null;
  }

  if (typeof payload === "object") {
    const maybeResult = payload as {
      calificacion?: number | string;
      resultado?: { calificacion?: number | string };
      data?: { calificacion?: number | string };
    };

    const direct = Number(maybeResult.calificacion);
    if (Number.isFinite(direct)) return direct;

    const nestedResultado = Number(maybeResult.resultado?.calificacion);
    if (Number.isFinite(nestedResultado)) return nestedResultado;

    const nestedData = Number(maybeResult.data?.calificacion);
    if (Number.isFinite(nestedData)) return nestedData;
  }

  return null;
};

/* ---- helpers de icono y color por índice ---- */
const ICONS = ["🌱", "🔢", "📖", "🌍", "🔬", "🎨", "🎵", "⚗️"];
const ICON_COLORS = ["#dcfce7", "#fef3c7", "#dbeafe", "#ede9fe", "#fce7f3", "#ffedd5"];

const CardStatus = ({ calificacion }: { calificacion: string }) => {
  if (!calificacion || calificacion === "Sin calificacion" || calificacion === "Sin sesion") {
    return null; /* se muestra Comenzar aparte */
  }

  const value = parseFloat(calificacion);
  if (value >= 100) {
    return (
      <View style={styles.statusCompleted}>
        <Text style={styles.statusCheck}>✓</Text>
        <Text style={styles.statusCompletedText}>Completada</Text>
      </View>
    );
  }

  return (
    <View style={styles.statusCircle}>
      <Text style={styles.statusCircleText}>{Math.round(value)}%</Text>
    </View>
  );
};

export default function PruebasScreen() {
  const router = useRouter();
  const { idTema, idAlumno, idProyecto, idCampo, campoNombre } = useLocalSearchParams();
  const pressAnimations = React.useRef<Record<string, Animated.Value>>({}).current;

  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [calificaciones, setCalificaciones] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPruebas = React.useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const requestTs = Date.now();
      const pruebasPath = `/api/pruebas?ts=${requestTs}`;

      const response = await fetchWithHostFallback(pruebasPath, {
        cache: "no-store",
      });
      const data = (await response.json()) as Prueba[];

      if (!response.ok) {
        const backendMessage =
          (data as unknown as { message?: string })?.message ||
          "No se pudieron cargar las pruebas.";
        setErrorMessage(backendMessage);
        setPruebas([]);
        return;
      }

      const temaId = Number(
        Array.isArray(idTema) ? idTema[0] : idTema
      );

      
      const filtered = data.filter(
        (item) => Number(item.idTema) === Number(temaId)
      );

      console.log("PARAM idTema:", idTema);
      console.log("temaId:", temaId);

      console.log(
        "API pruebas:",
        data.map((x) => ({
          titulo: x.titulo,
          idTema: x.idTema,
        }))
      );

      console.log("FILTERED:", filtered);
      const authUser = getAuthenticatedUser();
      const fallbackAlumno = Number(idAlumno);
      const alumnoId = authUser?.idUsuario || (Number.isFinite(fallbackAlumno) ? fallbackAlumno : null);

      if (!alumnoId) {
        const sinSesion = Object.fromEntries(
          filtered.map((item) => [item.idPrueba, "Sin sesion"])
        ) as Record<number, string>;
        setCalificaciones(sinSesion);
        setPruebas(filtered);
        return;
      }

      setPruebas(filtered);

      const resultadoEntries = await Promise.all(
        filtered.map(async (item) => {
          try {
            const resultadosPath = `/api/resultados/alumno/${alumnoId}/prueba/${item.idPrueba}?ts=${requestTs}`;
            const res = await fetchWithHostFallback(resultadosPath, {
              cache: "no-store",
            });

            if (res.status === 404) {
              return [item.idPrueba, "Sin calificacion"] as const;
            }

            const payload = (await res.json().catch(() => null)) as ResultadoApi | ResultadoApi[] | { data?: ResultadoApi } | null;

            if (!res.ok || !payload) {
              return [item.idPrueba, "Sin calificacion"] as const;
            }

            const calificacion = extractCalificacion(payload);

            if (calificacion === null) {
              return [item.idPrueba, "Sin calificacion"] as const;
            }

            return [item.idPrueba, `${calificacion.toFixed(2)}%`] as const;
          } catch {
            return [item.idPrueba, "Sin calificacion"] as const;
          }
        })
      );

      setCalificaciones(Object.fromEntries(resultadoEntries));
    } catch (error) {
      console.error("Error al cargar pruebas:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Error de red al obtener pruebas."
      );
    } finally {
      setLoading(false);
    }
  }, [idTema, idAlumno]);

  useEffect(() => {
    fetchPruebas();
  }, [fetchPruebas]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPruebas();
    }, [fetchPruebas])
  );

  const onBack = () => {
    const proyectoIdValue = String(idProyecto ?? "").trim();
    const campoIdValue = String(idCampo ?? "").trim();

    if (proyectoIdValue.length > 0) {
      router.replace({
        pathname: "/(tabs)/temas",
        params: {
          idProyecto: proyectoIdValue,
          idCampo: campoIdValue,
          campoNombre: String(campoNombre ?? ""),
        },
      });
      return;
    }

    const proyectoId = pruebas[0]?.Tema?.idProyecto;

    if (proyectoId) {
      router.replace({
        pathname: "/(tabs)/temas",
        params: { idProyecto: String(proyectoId) },
      });
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/campos");
  };

  const onStart = (idPrueba: number) => {
    const authUser = getAuthenticatedUser();
    const fallbackAlumno = Number(idAlumno);
    const alumnoId = authUser?.idUsuario || (Number.isFinite(fallbackAlumno) ? fallbackAlumno : undefined);

    router.push({
      pathname: "/(tabs)/formPruebas",
      params: {
        idPrueba: idPrueba.toString(),
        intento: Date.now().toString(),
        ...(alumnoId ? { idAlumno: String(alumnoId) } : {}),
      },
    });
  };

  const temaNombre = pruebas[0]?.Tema?.nombre || "Pruebas";

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
        source={require("../../../../../assets/images/Splash/fondo.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.stateText}>Cargando pruebas...</Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../../../../assets/images/Splash/fondo.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Animated.View style={getPressStyle("pruebas-back-button")}>
            <TouchableOpacity
              style={styles.btnBack}
              activeOpacity={1}
              onPressIn={() => animatePressIn("pruebas-back-button")}
              onPressOut={() => animatePressOut("pruebas-back-button")}
              onPress={() => animatePress("pruebas-back-button", onBack)}
            >
              <Text style={styles.btnBackTexto}>‹</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.headerTitleWrap}>
            <Image
              source={require("../../../../../assets/images/HomeScreen/Prueba.png")}
              style={styles.headerTitleIcon}
              resizeMode="contain"
            />
            <Text style={styles.headerTitulo}>Pruebas</Text>
            <Image
              source={require("../../../../../assets/images/HomeScreen/Prueba.png")}
              style={styles.headerTitleIcon}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerEspaciador} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <Text style={styles.sectionTitle}>Pruebas disponibles</Text>

          {pruebas.map((prueba, index) => {
          const cal = calificaciones[prueba.idPrueba];
          const sinResultado = !cal || cal === "Sin calificacion" || cal === "Sin sesion";
          const iconEmoji = ICONS[index % ICONS.length];
          const iconBg = ICON_COLORS[index % ICON_COLORS.length];
          const cardKey = `prueba-${prueba.idPrueba}`;

          return (
            <Animated.View key={prueba.idPrueba} style={getPressStyle(cardKey)}>
              <TouchableOpacity
                style={styles.tarjeta}
                onPressIn={() => animatePressIn(cardKey)}
                onPressOut={() => animatePressOut(cardKey)}
                onPress={() => animatePress(cardKey, () => onStart(prueba.idPrueba))}
                activeOpacity={1}
              >
                {/* ICONO */}
                <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
                  <Text style={styles.iconEmoji}>{iconEmoji}</Text>
                </View>

                {/* CONTENIDO */}
                <View style={styles.contenido}>
                  <Text style={styles.subtitulo}>{prueba.titulo}</Text>
                  <Text style={styles.descripcion}>
                    {prueba.Preguntas?.length || 0} preguntas
                  </Text>
                </View>

                {/* ESTADO */}
                <View style={styles.statusWrap}>
                  {sinResultado ? (
                    <View style={styles.startBtn}>
                      <Text style={styles.startBtnText}>Comenzar</Text>
                    </View>
                  ) : (
                    <CardStatus calificacion={cal} />
                  )}
                </View>

                {/* FLECHA */}
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </Animated.View>
          );
          })}

          {pruebas.length === 0 && !errorMessage ? (
            <Text style={styles.emptyText}>No hay pruebas para este tema.</Text>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },

  centeredState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  stateText: {
    color: "#6B7280",
    fontSize: 14,
  },

  header: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  btnBack: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },

  btnBackTexto: {
    fontSize: 24,
    color: "#374151",
    lineHeight: 28,
  },

  headerTitulo: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    letterSpacing: 0.2,
    marginHorizontal: 10,
  },

  headerTitleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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

  headerTitleIcon: {
    width: 24,
    height: 24,
  },

  headerEspaciador: {
    width: 36,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    gap: 10,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  errorText: {
    color: "#dc2626",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },

  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  iconEmoji: {
    fontSize: 28,
  },

  contenido: {
    flex: 1,
    gap: 3,
  },

  subtitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  descripcion: {
    fontSize: 12,
    color: "#6B7280",
  },

  statusWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  /* Completada */
  statusCompleted: {
    alignItems: "center",
    gap: 2,
  },
  statusCheck: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#22c55e",
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 34,
    overflow: "hidden",
  },
  statusCompletedText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#16a34a",
  },

  /* Círculo de porcentaje */
  statusCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
  },
  statusCircleText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6366f1",
  },

  /* Botón comenzar */
  startBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  startBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  arrow: {
    fontSize: 22,
    color: "#D1D5DB",
    marginLeft: -4,
  },

  emptyText: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
  },
});
