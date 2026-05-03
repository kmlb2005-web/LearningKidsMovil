import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getAuthenticatedUser } from "../../../../shared/utils/authSession";

type Prueba = {
  idPrueba: number;
  titulo: string;
  idTema: number;
  creadoPor: number;
  tema?: {
    idTema: number;
    nombre: string;
    descripcion: string;
    idProyecto: number;
  } | null;
  preguntas: Array<{ idPregunta: number; texto: string }>;
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
    const first = payload[0] as { calificacion?: number | string };
    const value = Number(first?.calificacion);
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

export default function PruebasScreen() {
  const router = useRouter();
  const { idTema, idAlumno } = useLocalSearchParams();

  const [pruebas, setPruebas] = useState<Prueba[]>([]);
  const [calificaciones, setCalificaciones] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchPruebas = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await fetch("http://192.168.1.72:5125/api/pruebas");
        const data = (await response.json()) as Prueba[];

        if (!response.ok) {
          const backendMessage =
            (data as unknown as { message?: string })?.message ||
            "No se pudieron cargar las pruebas.";
          setErrorMessage(backendMessage);
          setPruebas([]);
          return;
        }

        const temaId = Number(idTema);
        const filtered = Number.isFinite(temaId)
          ? data.filter((item) => item.idTema === temaId)
          : data;

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

        const resultadoEntries = await Promise.all(
          filtered.map(async (item) => {
            try {
              const res = await fetch(
                `http://192.168.1.72:5125/api/resultados/alumno/${alumnoId}/prueba/${item.idPrueba}`
              );

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
        setPruebas(filtered);
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
    };

    fetchPruebas();
  }, [idTema, idAlumno]);

  const onBack = () => router.back();

  const onStart = (idPrueba: number) => {
    const authUser = getAuthenticatedUser();
    const fallbackAlumno = Number(idAlumno);
    const alumnoId = authUser?.idUsuario || (Number.isFinite(fallbackAlumno) ? fallbackAlumno : undefined);

    router.push({
      pathname: "/(tabs)/formPruebas",
      params: {
        idPrueba: idPrueba.toString(),
        ...(alumnoId ? { idAlumno: String(alumnoId) } : {}),
      },
    });
  };

  const temaNombre = pruebas[0]?.tema?.nombre || "Pruebas";

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.stateText}>Cargando pruebas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnBack} onPress={onBack}>
          <Text style={styles.btnBackTexto}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>{temaNombre}</Text>
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

        {pruebas.map((prueba) => (
          <View key={prueba.idPrueba} style={styles.tarjeta}>
            <View style={styles.circuloNumero}>
              <Text style={styles.numeroTexto}>{prueba.idPrueba}</Text>
            </View>

            <View style={styles.contenido}>
              <Text style={styles.subtitulo}>{prueba.titulo}</Text>
              <Text style={styles.descripcion}>
                {prueba.preguntas?.length || 0} pregunta(s)
              </Text>
              <Text style={styles.calificacionText}>
                Calificacion: {calificaciones[prueba.idPrueba] || "Cargando..."}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => onStart(prueba.idPrueba)}
            >
              <Text style={styles.startBtnText}>Comenzar</Text>
            </TouchableOpacity>
          </View>
        ))}

        {pruebas.length === 0 && !errorMessage ? (
          <Text style={styles.emptyText}>No hay pruebas para este tema.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  btnBack: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  btnBackTexto: {
    fontSize: 24,
    color: "#374151",
    lineHeight: 28,
  },

  headerTitulo: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
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

  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  circuloNumero: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  numeroTexto: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1D4ED8",
  },

  contenido: {
    flex: 1,
    gap: 2,
  },

  subtitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  descripcion: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
  },

  calificacionText: {
    fontSize: 12,
    color: "#0f766e",
    fontWeight: "700",
  },

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

  emptyText: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
  },
});
