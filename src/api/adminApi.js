import { apiClient } from "./apiClient";

export const blockUser = async (userId) => {
  return apiClient(`/admin/users/${userId}/block`, { method: "PATCH" });
};

export const unblockUser = async (userId) => {
  return apiClient(`/admin/users/${userId}/block`, { method: "DELETE" });
};

export const upgradeUser = async (userId) => {
  return apiClient(`/admin/users/${userId}/op`, { method: "PATCH" });
};