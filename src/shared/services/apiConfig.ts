const ENV_API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "").trim();

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

// Priority order: explicit env var (LAN IP of the local API), Android emulator, web localhost.
const DEFAULT_API_BASE_URLS = [
  "http://10.0.2.2:5125",
  "http://localhost:5125",
];

export function getApiBaseUrls(): string[] {
  const unique = new Set<string>();

  if (ENV_API_BASE_URL) {
    unique.add(normalizeBaseUrl(ENV_API_BASE_URL));
  }

  for (const baseUrl of DEFAULT_API_BASE_URLS) {
    unique.add(normalizeBaseUrl(baseUrl));
  }

  return Array.from(unique);
}

export function buildApiEndpoints(path: string): string[] {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return getApiBaseUrls().map((baseUrl) => `${baseUrl}${normalizedPath}`);
}

// Single URL for screens that do not retry across base URLs.
export function apiUrl(path: string): string {
  return buildApiEndpoints(path)[0];
}
