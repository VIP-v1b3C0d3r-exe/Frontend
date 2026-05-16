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