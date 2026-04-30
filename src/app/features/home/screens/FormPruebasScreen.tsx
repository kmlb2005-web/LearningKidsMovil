import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

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

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

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
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No hay preguntas</Text>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[current];

  /* ========= LOGICA ========= */
  const handleNext = () => {
    if (selected === null) return;

    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
    } else {
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

  /* ========= RESULT ========= */
  if (finished) {
    const score = calculateScore();

    return (
      <SafeAreaView style={styles.container}>
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

          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              setCurrent(0);
              setAnswers([]);
              setFinished(false);
              setSelected(null);
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
    <SafeAreaView style={styles.container}>
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
    justifyContent: "center",
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
});