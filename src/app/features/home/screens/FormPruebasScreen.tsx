import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams, useRouter } from "expo-router";

import { getAuthenticatedUser } from "../../../../shared/utils/authSession";

/* ========= TYPES ========= */
type ApiRespuesta = {
  idRespuesta: number;
  texto: string;
  esCorrecta: boolean;
};

type ApiPregunta = {
  idPregunta: number;
  texto: string;
  idPrueba: number;
  respuestas: ApiRespuesta[];
};

type Question = {
  id: number;
  question: string;
  options: string[];
  correct: number;
};

export default function FormPruebas() {
  const { idPrueba } = useLocalSearchParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState(false);

  /* ========= FETCH ========= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://192.168.1.72:5125/api/preguntas"
        );
        const data: ApiPregunta[] = await res.json();

        const filtradas = data.filter(
          (p) => p.idPrueba === Number(idPrueba)
        );

        const mapped: Question[] = filtradas.map((p) => ({
          id: p.idPregunta,
          question: p.texto,
          options: p.respuestas.map((r) => r.texto),
          correct: p.respuestas.findIndex(
            (r) => r.esCorrecta
          ),
        }));

        setQuestions(mapped);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idPrueba]);

  /* ========= LOADING ========= */
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
        <Text>No hay preguntas</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[current];

  /* ========= LOGICA ========= */
  const handleNext = async () => {
    if (selected === null) return;

    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
      const correct = newAnswers.filter(
        (ans, i) => ans === questions[i].correct
      ).length;
      await saveResult(correct);
      setFinished(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((ans, i) => {
      if (ans === questions[i].correct) correct++;
    });
    return correct;
  };

  const saveResult = async (score: number) => {
    const authUser = getAuthenticatedUser();

    if (!authUser?.idUsuario) {
      setSaveError(true);
      setSaveMessage("No se encontro el usuario autenticado. Inicia sesion de nuevo.");
      return;
    }

    const BASE = "http://192.168.1.72:5125/api/resultados";
    const idAlumno = authUser.idUsuario;
    const idPruebaNum = Number(idPrueba);
    const calificacion = parseFloat(
      ((score / questions.length) * 100).toFixed(2)
    );
    const fecha = new Date().toISOString();
    const headers = { "Content-Type": "application/json" };
    const body = JSON.stringify({ idAlumno, idPrueba: idPruebaNum, calificacion, fecha });

    try {
      /* 1. Buscar resultados de este alumno + prueba */
      const getRes = await fetch(`${BASE}/alumno/${idAlumno}/prueba/${idPruebaNum}`);
      const existing = await getRes.json().catch(() => null);

      const record = Array.isArray(existing)
        ? [...existing]
            .filter(
              (r: { idAlumno?: number; idPrueba?: number; idResultado?: number }) =>
                r.idAlumno === idAlumno && r.idPrueba === idPruebaNum
            )
            .sort((a, b) => {
              const aTime = a?.fecha ? new Date(a.fecha).getTime() : 0;
              const bTime = b?.fecha ? new Date(b.fecha).getTime() : 0;

              if (aTime !== bTime) {
                return bTime - aTime;
              }

              return (b?.idResultado ?? 0) - (a?.idResultado ?? 0);
            })[0] ?? null
        : existing?.idResultado
        ? existing
        : null;

      let response: Response;

      if (record?.idResultado) {
        /* 2a. Ya existe → PUT para actualizar */
        response = await fetch(`${BASE}/${record.idResultado}`, {
          method: "PUT",
          headers,
          body,
        });
      } else {
        /* 2b. No existe → POST para crear */
        response = await fetch(BASE, {
          method: "POST",
          headers,
          body,
        });
      }

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const backendMessage =
          (payload && typeof payload === "object" && "message" in payload
            ? String((payload as { message?: string }).message)
            : "No se pudo guardar el resultado.") ||
          "No se pudo guardar el resultado.";

        setSaveError(true);
        setSaveMessage(backendMessage);
        return;
      }

      setSaveError(false);
      setSaveMessage(
        record?.idResultado
          ? "Resultado actualizado correctamente."
          : "Resultado guardado correctamente."
      );
    } catch (error) {
      console.error("Error al guardar resultado:", error);
      setSaveError(true);
      setSaveMessage(
        error instanceof Error
          ? error.message
          : "Error de red al guardar el resultado."
      );
    }
  };

  /* ========= RESULT ========= */
  if (finished) {
    const score = calculateScore();

    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>
            Resultado final
          </Text>

          <Text style={styles.score}>
            {score} / {questions.length}
          </Text>

          <Text style={styles.subtitle}>
            Puntaje obtenido
          </Text>

          {saveMessage ? (
            <Text
              style={[
                styles.saveMessage,
                saveError ? styles.saveMessageError : styles.saveMessageSuccess,
              ]}
            >
              {saveMessage}
            </Text>
          ) : null}

          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setCurrent(0);
              setAnswers([]);
              setFinished(false);
              setSelected(null);
              setSaveMessage("");
              setSaveError(false);
            }}
          >
            <Text style={styles.btnText}>
              Volver a intentar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /* ========= UI ========= */
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* BACK BUTTON */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>‹</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.progress}>
          {current + 1} / {questions.length}
        </Text>

        <Text style={styles.question}>
          {currentQuestion.question}
        </Text>

        {currentQuestion.options.map((opt, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selected === index && styles.optionSelected,
            ]}
            onPress={() => setSelected(index)}
          >
            <Text style={styles.optionText}>
              {opt}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.btn,
            selected === null && { opacity: 0.5 },
          ]}
          onPress={handleNext}
        >
          <Text style={styles.btnText}>
            {current === questions.length - 1
              ? "Finalizar"
              : "Siguiente"}
          </Text>
        </TouchableOpacity>
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

  backBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 24,
    color: "#374151",
    lineHeight: 28,
  },

  content: {
    padding: 20,
    paddingBottom: 100,
  },

  progress: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 10,
  },

  question: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1e293b",
  },

  option: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  optionSelected: {
    borderWidth: 2,
    borderColor: "#3b82f6",
  },

  optionText: {
    fontSize: 14,
    color: "#1e293b",
  },

  btn: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
  },

  resultContainer: {
    alignItems: "center",
  },

  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },

  score: {
    fontSize: 40,
    fontWeight: "800",
    color: "#3b82f6",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: 20,
  },

  saveMessage: {
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },

  saveMessageError: {
    color: "#dc2626",
  },

  saveMessageSuccess: {
    color: "#16a34a",
  },
});