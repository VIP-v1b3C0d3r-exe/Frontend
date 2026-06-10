import { apiClient } from "./apiClient";

export const loginUser = async ({ email, password }) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
};

export const registerUser = async ({ username, email, password, age }) => {
  return apiClient("/auth/register", {
    method: "POST",
    body: {
      username,
      email,
      password,
      age,
    },
  });
};

export const refreshToken = async (refreshTokenValue) => {
  return apiClient("/auth/refresh", {
    method: "POST",
    body: {
      refreshToken: refreshTokenValue,
    },
  });
};

export const forgotPassword = async ({ email }) => {
  return apiClient("/auth/forgot-password", {
    method: "POST",
    body: {
      email,
    },
  });
};

export const resetPassword = async ({ token, password }) => {
  return apiClient("/auth/reset-password", {
    method: "POST",
    body: {
      token,
      password,
    },
  });
};

export const getCurrentUser = async () => {
  return apiClient("/users/me");
};
