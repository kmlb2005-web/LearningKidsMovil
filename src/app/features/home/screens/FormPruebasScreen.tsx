import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getAuthenticatedUser } from "../../../../shared/utils/authSession";

/* ========= TYPES ========= */
type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
};

type ApiOption = {
  texto?: string;
  esCorrecta?: boolean;
};

type ApiQuestion = {
  idPregunta?: number;
  id?: number;
  texto?: string;
  pregunta?: string;
  opciones?: ApiOption[];
  respuestas?: ApiOption[];
};

type ApiPrueba = {
  titulo?: string;
  idTema?: number;
  preguntas?: ApiQuestion[];
};

async function safeReadJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export default function PruebaScreen() {
  const { idPrueba, idAlumno, idTema, idProyecto, idCampo, campoNombre } = useLocalSearchParams<{
    idPrueba?: string | string[];
    idAlumno?: string | string[];
    idTema?: string | string[];
    idProyecto?: string | string[];
    idCampo?: string | string[];
    campoNombre?: string | string[];
  }>();
  const router = useRouter();
  const pruebaId = Array.isArray(idPrueba) ? idPrueba[0] : idPrueba;
  const alumnoIdParam = Array.isArray(idAlumno) ? idAlumno[0] : idAlumno;
  const idTemaParam = Array.isArray(idTema) ? idTema[0] : idTema;
  const idProyectoParam = Array.isArray(idProyecto) ? idProyecto[0] : idProyecto;
  const idCampoParam = Array.isArray(idCampo) ? idCampo[0] : idCampo;
  const campoNombreParam = Array.isArray(campoNombre) ? campoNombre[0] : campoNombre;

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [answers, setAnswers] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [temaIdFromPrueba, setTemaIdFromPrueba] = useState<number | null>(null);

  /* ========= FETCH ========= */
  useEffect(() => {
    const fetchData = async () => {
      if (!pruebaId) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      try {
        // 🔥 1. traer prueba
        const res = await fetch(
          `http://192.168.1.72:5125/api/pruebas/${pruebaId}`
        );
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status} al cargar prueba`);
        }

        const data = await safeReadJson<ApiPrueba>(res);
        if (!data) {
          throw new Error("La API de prueba devolvio JSON vacio o invalido");
        }

        setTitle(data.titulo || "Prueba");
        setTemaIdFromPrueba(Number.isFinite(Number(data.idTema)) ? Number(data.idTema) : null);

        const questionsWithOptions: Question[] = (data.preguntas || []).map((p) => {
          const optionsSource = p.opciones || p.respuestas || [];

          return {
            id: p.idPregunta ?? p.id ?? 0,
            question: p.texto || p.pregunta || "",
            options: optionsSource.map((r) => r.texto || ""),
            correct: optionsSource.findIndex((r) => !!r.esCorrecta),
          };
        });

        setQuestions(questionsWithOptions);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pruebaId]);

  /* ========= LOGIC ========= */
  const handleNext = async () => {
    if (selected === null) return;

    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);

    const isCorrect = selected === currentQuestion.correct;
    const nextCorrectCount = isCorrect ? correctCount + 1 : correctCount;

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    }

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      const endTime = Date.now();
      const timeSeconds = Math.floor((endTime - startTime) / 1000);
      const authUser = getAuthenticatedUser();
      const fallbackAlumno = Number(alumnoIdParam);
      const alumnoId = authUser?.idUsuario || (Number.isFinite(fallbackAlumno) ? fallbackAlumno : null);
      const calificacion = Number(((nextCorrectCount / questions.length) * 100).toFixed(2));

      setElapsedSeconds(timeSeconds);
      setFinished(true);

      try {
        await fetch("http://192.168.1.72:5125/api/resultados", {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idPrueba: Number(pruebaId),
            ...(alumnoId ? { idAlumno: alumnoId } : {}),
            correctas: nextCorrectCount,
            incorrectas: questions.length - nextCorrectCount,
            tiempo: timeSeconds,
            calificacion,
          }),
        });
      } catch (err) {
        console.log("Error guardando resultado", err);
      }
    }
  };

  const handleRetry = () => {
    setAnswers([]);
    setCorrectCount(0);
    setFinished(false);
    setCurrent(0);
    setSelected(null);
    setStartTime(Date.now());
    setElapsedSeconds(0);
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <Text>No hay preguntas disponibles</Text>
      </SafeAreaView>
    );
  }

  if (finished) {
    const total = questions.length;
    const incorrect = total - correctCount;
    const percent = Math.round((correctCount / total) * 100);

    const formatTime = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    };

    const temaIdValue = String(idTemaParam ?? "").trim() || (temaIdFromPrueba ? String(temaIdFromPrueba) : "");
    const proyectoIdValue = String(idProyectoParam ?? "").trim();
    const campoIdValue = String(idCampoParam ?? "").trim();
    const campoNombreValue = String(campoNombreParam ?? "").trim();

    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <Text style={styles.resultTitle}>Resultados</Text>

        <Image
          source={require("../../../../../assets/images/Register/louz.png")}
          style={styles.resultRobot}
        />

        <View style={styles.cardResult}>
          <Text style={styles.resultMsg}>
            ¡Muy bien! 🎉
          </Text>

          <Text style={styles.score}>
            {correctCount} / {total}
          </Text>

          <Text style={styles.scoreLabel}>
            Puntaje obtenido
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: "#dcfce7" }]}>
            <Text style={{ color: "#16a34a" }}>Correctas</Text>
            <Text style={styles.statValue}>{correctCount}</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: "#fee2e2" }]}>
            <Text style={{ color: "#dc2626" }}>Incorrectas</Text>
            <Text style={styles.statValue}>{incorrect}</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: "#ede9fe" }]}>
            <Text style={{ color: "#7c3aed" }}>Tiempo</Text>
            <Text style={styles.statValue}>
              {formatTime(elapsedSeconds)}
            </Text>
          </View>
        </View>

        <View style={styles.performance}>
          <Text>Desempeño</Text>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${percent}%` },
              ]}
            />
          </View>
          <Text>{percent}%</Text>
        </View>

        <View style={[styles.robotBox, styles.resultRobotBox]}>
          <Image
            source={require("../../../../../assets/images/CamposFormativos/louzSaludando.png")}
            style={[styles.robot, styles.resultLouz]}
          />
          <View style={[styles.bubble, styles.resultBubble]}>
            <Text style={styles.bubbleText}>
              Sigue practicando para mejorar aún más 🚀
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, styles.resultActionBtn, styles.retryBtn]}
          onPress={handleRetry}
        >
          <Text style={styles.secondaryBtnText}>
            Volver a intentar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.resultActionBtn, styles.backToTestsBtn]}
          onPress={() =>
            router.replace({
              pathname: "/(tabs)/pruebas",
              params: {
                ...(temaIdValue ? { idTema: temaIdValue } : {}),
                ...(alumnoIdParam ? { idAlumno: alumnoIdParam } : {}),
                ...(proyectoIdValue ? { idProyecto: proyectoIdValue } : {}),
                ...(campoIdValue ? { idCampo: campoIdValue } : {}),
                ...(campoNombreValue ? { campoNombre: campoNombreValue } : {}),
              },
            })
          }
        >
          <Text style={styles.btnText}>
            Regresar a Pruebas
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[current];
  const total = questions.length;
  const progress = ((current + 1) / total) * 100;

  const messages = [
    "Lee con calma y elige tu mejor respuesta ✨",
    "¡Vas muy bien! 🚀",
    "Sigue así 💪",
    "Confía en ti 🤖",
    "Ya casi terminas 🎯",
  ];

  const msgIndex = current === 0
    ? 0
    : (Math.floor((current - 1) / 2) % (messages.length - 1)) + 1;

  /* ========= UI ========= */
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{title}</Text>

        <Image
          source={require("../../../../../assets/images/Register/louz.png")}
          style={styles.headerRobot}
        />
      </View>

      {/* PROGRESS */}
      <View style={styles.progressContainer}>
        <View
          style={[styles.progressBar, { width: `${progress}%` }]}
        />
      </View>

      {/* CONTADOR */}
      <Text style={styles.counter}>
        {current + 1} / {total}
      </Text>

      {/* PREGUNTA */}
      <Text style={styles.question}>
        {currentQuestion.question}
      </Text>

      {/* OPCIONES */}
      <View style={styles.options}>
        {currentQuestion.options.length === 0 ? (
          <Text style={{ color: "#64748b" }}>
            No hay respuestas disponibles
          </Text>
        ) : (
          currentQuestion.options.map((opt, index) => {
            const isSelected = selected === index;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
                onPress={() => setSelected(index)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {String.fromCharCode(65 + index)}. {opt}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* ROBOT MENSAJE */}
      <View style={styles.robotBox}>
        <Image
          source={require("../../../../../assets/images/CamposFormativos/louzSaludando.png")}
          style={styles.robot}
        />
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>
            {messages[msgIndex]}
          </Text>
        </View>
      </View>

      {/* BOTON */}
      {currentQuestion.options.length > 0 && (
        <TouchableOpacity
          style={[
            styles.btn,
            selected === null && { opacity: 0.5 },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.btnText}>
            {current === total - 1
              ? "Finalizar"
              : "Siguiente →"}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

/* ========= STYLES ========= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f3",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    fontSize: 22,
  },

  headerTitle: {
    fontWeight: "700",
    fontSize: 16,
  },

  headerRobot: {
    width: 50,
    height: 50,
  },

  progressContainer: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    marginVertical: 12,
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 10,
  },

  counter: {
    backgroundColor: "#3b82f6",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 10,
  },

  question: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
  },

  options: {
    gap: 10,
  },

  option: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
  },

  optionText: {
    fontWeight: "600",
  },

  optionSelected: {
    backgroundColor: "#dbeafe",
    borderWidth: 2,
    borderColor: "#3b82f6",
  },

  optionTextSelected: {
    color: "#1d4ed8",
  },

  robotBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginLeft: -34,
  },

  robot: {
    width: 228,
    height: 228,
  },

  bubble: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: -18,
    maxWidth: 230,
    minWidth: 190,
  },

  bubbleText: {
    color: "#1e3a8a",
    fontSize: 16,
    fontWeight: "700",
  },

  btn: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },

  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  resultRobot: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginVertical: 10,
  },

  cardResult: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginVertical: 10,
  },

  resultMsg: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2563eb",
  },

  score: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2563eb",
  },

  scoreLabel: {
    color: "#64748b",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  statBox: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
  },

  statValue: {
    fontWeight: "700",
    fontSize: 16,
  },

  performance: {
    marginVertical: 10,
  },

  resultRobotBox: {
    marginTop: -18,
    marginLeft: 0,
  },

  resultLouz: {
    width: 150,
    height: 150,
  },

  resultBubble: {
    marginLeft: 10,
    maxWidth: 200,
    minWidth: 150,
  },

  resultActionBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderWidth: 1,
  },

  retryBtn: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
  },

  backToTestsBtn: {
    backgroundColor: "#2563eb",
    borderColor: "#1d4ed8",
  },

  secondaryBtnText: {
    color: "#92400e",
    fontWeight: "700",
  },
});