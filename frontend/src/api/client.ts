const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const API_KEY = import.meta.env.VITE_API_KEY;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  body?: any;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
) {
  const { body, ...customConfig } = options;

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // FastAPI's HTTPException uses "detail"; slowapi's rate-limit handler uses "error".
    const message = errorData.detail || errorData.error || `Error ${response.status}`;
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}
