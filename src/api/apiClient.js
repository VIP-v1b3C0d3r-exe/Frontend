import { refreshToken } from "./authApi";

const API_URL = "/api";

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const isPublicEndpoint = (endpoint) => {
  return PUBLIC_ENDPOINTS.some((publicEndpoint) =>
    endpoint.startsWith(publicEndpoint)
  );
};

export async function apiClient(endpoint, options = {}) {
  let token = localStorage.getItem("token");

  const url = `${API_URL}${endpoint}`;

  console.log("[API REQUEST]", {
    url,
    endpoint,
    method: options.method || "GET",
    token: token ? "exists" : "missing",
    body: options.body,
  });

  let response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(!isPublicEndpoint(endpoint) && token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...options.headers,
    },
  });

  if (
    !isPublicEndpoint(endpoint) &&
    !options.silent &&
    response.status === 401
  ) {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (!storedRefreshToken) {
        throw new Error("No refresh token");
      }

      const refreshResponse = await refreshToken(storedRefreshToken);

      const newAccessToken = refreshResponse?.data?.access_token;
      const newRefreshToken = refreshResponse?.data?.refresh_token;

      if (!newAccessToken || !newRefreshToken) {
        throw new Error("Failed to refresh token");
      }

      localStorage.setItem("token", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);

      token = newAccessToken;

    
      response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });
    } catch (refreshError) {
      console.error("Refresh token error:", refreshError);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      if (!options.silent) {
        window.location.href = "/login";
      }
      throw refreshError;
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    const msg = error?.error?.message ?? error?.error?.details ?? `HTTP ${response.status}`;
    console.error("[API ERROR]", response.status, url, error);
    throw new Error(msg);
  }

  return response.json();
}