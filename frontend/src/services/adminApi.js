const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

const getToken = () =>
  localStorage.getItem("access_token") ||
  localStorage.getItem("token");

const adminRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail ||
        data.message ||
        `Request failed with status ${response.status}`
    );
  }

  return data;
};

// ================= DASHBOARD =================

export const getAdminDashboard = () =>
  adminRequest("/admin/dashboard");

// ================= USERS =================

export const getAdminUsers = () =>
  adminRequest("/admin/users");

export const createAdminUser = (userData) =>
  adminRequest("/admin/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const updateAdminUser = (userId, userData) =>
  adminRequest(`/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });

export const deleteAdminUser = (userId) =>
  adminRequest(`/admin/users/${userId}`, {
    method: "DELETE",
  });

export const updateAdminUserStatus = (
  userId,
  isActive
) =>
  adminRequest(`/admin/users/${userId}/status`, {
    method: "PUT",
    body: JSON.stringify({
      is_active: isActive,
    }),
  });

// ================= DATASETS =================

export const getAdminDatasets = () =>
  adminRequest("/admin/datasets");

export const createAdminDataset = (datasetData) =>
  adminRequest("/admin/datasets", {
    method: "POST",
    body: JSON.stringify(datasetData),
  });

export const deleteAdminDataset = (datasetId) =>
  adminRequest(`/admin/datasets/${datasetId}`, {
    method: "DELETE",
  });

// ================= PREDICTIONS =================

export const getAdminPredictions = () =>
  adminRequest("/admin/predictions");

// ================= ANALYTICS =================

export const getAdminAnalytics = () =>
  adminRequest("/admin/analytics");

// ================= ACTIVITY LOGS =================

export const getAdminActivityLogs = () =>
  adminRequest("/admin/activity-logs");