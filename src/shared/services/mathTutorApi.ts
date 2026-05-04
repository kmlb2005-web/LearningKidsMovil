import { buildApiEndpoints } from "./apiConfig";

export interface MathChatResponse {
  text: string;
  grade: number;
  hasLatex: boolean;
  isAnswerVerification: boolean;
}

export interface MathExerciseResponse {
  exercise: string;
  topic: string;
  grade: number;
  hasLatex: boolean;
}

async function requestWithHostFallback<T>(
  endpointPath: string,
  init?: RequestInit
): Promise<T> {
  const endpoints = buildApiEndpoints(endpointPath);
  let lastNetworkError: unknown = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, init);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      // Continue only when it's likely a connectivity issue to that host.
      const message = error instanceof Error ? error.message : "";
      const isNetworkError =
        message.toLowerCase().includes("failed to fetch") ||
        message.toLowerCase().includes("network") ||
        message.toLowerCase().includes("load failed") ||
        message.toLowerCase().includes("fetch");

      if (!isNetworkError) {
        throw error;
      }

      lastNetworkError = error;
    }
  }

  if (lastNetworkError instanceof Error) {
    throw lastNetworkError;
  }

  throw new Error("No fue posible conectar con el backend en ninguna URL.");
}

export async function chatMath(
  query: string,
  studentAnswer?: string
): Promise<MathChatResponse> {
  return requestWithHostFallback<MathChatResponse>("/api/math/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, studentAnswer }),
  });
}

export async function getExercise(
  topic?: string
): Promise<MathExerciseResponse> {
  const endpointPath = topic
    ? `/api/math/exercise?topic=${encodeURIComponent(topic)}`
    : "/api/math/exercise";

  return requestWithHostFallback<MathExerciseResponse>(endpointPath);
}

export async function verifyAnswer(
  problem: string,
  answer: string
): Promise<MathChatResponse> {
  return requestWithHostFallback<MathChatResponse>("/api/math/verify-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problem, answer }),
  });
}
