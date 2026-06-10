import { apiClient } from "./apiClient";

export const loginUser = async ({ email, password }) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const registerUser = async ({ username, email, password, age }) => {
  return apiClient("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
      age,
    }),
  });
};

export const refreshToken = async (refreshTokenValue) => {
  return apiClient("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({
      refreshToken: refreshTokenValue,
    }),
  });
};

export const forgotPassword = async ({ email }) => {
  return apiClient("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
};

export const resetPassword = async ({ token, password }) => {
  return apiClient("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      token,
      password,
    }),
  });
};

export const getCurrentUser = async () => {
  return apiClient("/users/me");
};