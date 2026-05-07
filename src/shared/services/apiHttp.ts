import { buildApiEndpoints } from "./apiConfig";

function isLikelyNetworkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  return (
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("load failed") ||
    message.includes("fetch")
  );
}

export async function fetchWithHostFallback(
  endpointPath: string,
  init?: RequestInit
): Promise<Response> {
  const endpoints = buildApiEndpoints(endpointPath);
  let lastNetworkError: unknown = null;

  for (const endpoint of endpoints) {
    try {
      return await fetch(endpoint, init);
    } catch (error) {
      if (!isLikelyNetworkError(error)) {
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
