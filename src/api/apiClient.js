import { refreshToken } from "./authApi";

const API_URL = "/api";

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const isPublicEndpoint = (endpoint) =>
  PUBLIC_ENDPOINTS.some((publicEndpoint) =>
    endpoint.startsWith(publicEndpoint)
  );

export async function apiClient(endpoint, options = {}) {
  let token = localStorage.getItem("token");

  const url = `${API_URL}${endpoint}`;

  const body =
    options.body && typeof options.body !== "string"
      ? JSON.stringify(options.body)
      : options.body;

  console.log("[API REQUEST]", {
    url,
    endpoint,
    method: options.method || "GET",
    token: token ? "exists" : "missing",
    body: options.body,
  });

  let response = await fetch(url, {
    ...options,
    body,
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
    (response.status === 401 || response.status === 403)
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
        body,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      });
    } catch (refreshError) {
      console.error("Refresh token error:", refreshError);

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      window.location.href = "/login";

      throw refreshError;
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error?.error?.message || error?.message || `HTTP ${response.status}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json().catch(() => null);
}
