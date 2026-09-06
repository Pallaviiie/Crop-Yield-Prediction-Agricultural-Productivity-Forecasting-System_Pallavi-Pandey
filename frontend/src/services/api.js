// ============================================================
// YIELDSENSE AI - API SERVICE
// ============================================================

const API_URL = import.meta.env.VITE_API_URL;

// ============================================================
// TOKEN
// ============================================================

const getToken = () => {
  return (
    localStorage.getItem("access_token") ||
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    ""
  );
};

// ============================================================
// HEADERS
// ============================================================

const getHeaders = (auth = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// ============================================================
// COMMON RESPONSE HANDLER
// ============================================================

const parseResponse = async (response) => {
  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    let message =
      data?.detail ||
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    if (Array.isArray(message)) {
      message = message
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          return (
            item?.msg ||
            item?.message ||
            "Invalid request"
          );
        })
        .join(", ");
    }

    throw new Error(message);
  }

  return data;
};

// ============================================================
// GENERIC REQUEST
// ============================================================

const request = async (
  endpoint,
  options = {}
) => {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        ...(options.body instanceof FormData
          ? {}
          : getHeaders(true)),

        ...(options.headers || {}),
      },
    }
  );

  return parseResponse(response);
};

// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (
  email,
  password
) => {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(
    `${API_URL}/users/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },

      body: formData.toString(),
    }
  );

  const data =
    await parseResponse(response);

  return data;
};

// ============================================================
// CURRENT USER
// ============================================================

export const getCurrentUser = async () => {
  const data = await request(
    "/users/me",
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  console.log(
    "GET CURRENT USER:",
    data
  );

  return (
    data?.profile ||
    data?.consultant ||
    data?.user ||
    data?.data?.profile ||
    data?.data?.user ||
    data
  );
};

// ============================================================
// UPDATE CURRENT USER
// ============================================================

export const updateCurrentUser = async (
  profileData
) => {
  const data = await request(
    "/users/me",
    {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(profileData),
    }
  );

  console.log(
    "UPDATE CURRENT USER:",
    data
  );

  return (
    data?.profile ||
    data?.consultant ||
    data?.user ||
    data?.data?.profile ||
    data?.data?.user ||
    data
  );
};

// ============================================================
// CONSULTANT PROFILE
// ============================================================
// Uses the same authenticated /users/me endpoint
// because your registration/login system stores consultant
// information as a user.

export const getConsultantProfile = async () => {
  const data =
    await getCurrentUser();

  return {
    consultant: data,
    profile: data,
    ...data,
  };
};

export const updateConsultantProfile = async (
  profileData
) => {
  const data =
    await updateCurrentUser(
      profileData
    );

  return {
    consultant: data,
    profile: data,
    ...data,
  };
};

// ============================================================
// PROFILE IMAGE
// ============================================================

export const uploadProfileImage = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const token = getToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/users/profile-image`,
    {
      method: "POST",
      headers,
      body: formData,
    }
  );

  const data = await parseResponse(response);

  console.log("UPLOAD PROFILE IMAGE RESPONSE:", data);

  return (
    data?.profile ||
    data?.consultant ||
    data?.user ||
    data?.data?.profile ||
    data?.data?.user ||
    data
  );
};
// ============================================================
// DELETE PROFILE IMAGE
// ============================================================

export const deleteProfileImage = async () => {
  const token = getToken();

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/users/profile-image`,
    {
      method: "DELETE",
      headers,
    }
  );

  const data = await parseResponse(response);

  console.log("DELETE PROFILE IMAGE RESPONSE:", data);

  return (
    data?.profile ||
    data?.consultant ||
    data?.user ||
    data?.data?.profile ||
    data?.data?.user ||
    data
  );
};
// ============================================================
// DATASET
// ============================================================

export const getDatasetSummary =
  async () => {
    return request(
      "/datasets/summary"
    );
  };

export const getCropData =
  async () => {
    return request(
      "/datasets/crop"
    );
  };

export const getSoilData =
  async () => {
    return request(
      "/datasets/soil"
    );
  };

export const getRainfallData =
  async () => {
    return request(
      "/datasets/rainfall"
    );
  };

export const getTemperatureData =
  async () => {
    return request(
      "/datasets/temperature"
    );
  };

export const getPesticideData =
  async () => {
    return request(
      "/datasets/pesticides"
    );
  };

// ============================================================
// DATASET ANALYTICS
// ============================================================

export const getCropAnalytics =
  async () => {
    return request(
      "/datasets/analytics/crop"
    );
  };

export const getSoilAnalytics =
  async () => {
    return request(
      "/datasets/analytics/soil"
    );
  };

export const getRainfallAnalytics =
  async () => {
    return request(
      "/datasets/analytics/rainfall"
    );
  };

export const getTemperatureAnalytics =
  async () => {
    return request(
      "/datasets/analytics/temperature"
    );
  };

export const getPesticideAnalytics =
  async () => {
    return request(
      "/datasets/analytics/pesticides"
    );
  };

// ============================================================
// CROP YIELD PREDICTION
// ============================================================

export const predictCropYield =
  async (predictionData) => {
    return request(
      "/prediction/predict",
      {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(
          predictionData
        ),
      }
    );
  };

// ============================================================
// RISK
// ============================================================

export const assessFarmRisk =
  async (riskData) => {
    return request(
      "/risk-assessment/",
      {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(
          riskData
        ),
      }
    );
  };

// ============================================================
// PREDICTION HISTORY
// ============================================================

export const getPredictionHistory =
  async () => {
    return request(
      "/prediction/history",
      {
        method: "GET",
        headers: getHeaders(true),
      }
    );
  };

// ============================================================
// WEATHER
// ============================================================

export const getWeatherForecast =
  async (
    latitude,
    longitude
  ) => {
    const params =
      new URLSearchParams({
        latitude,
        longitude,
      });

    return request(
      `/weather/forecast?${params.toString()}`
    );
  };

// ============================================================
// SOIL
// ============================================================

export const analyzeSoil =
  async (soilData) => {
    return request(
      "/soil/analyze",
      {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(
          soilData
        ),
      }
    );
  };

// ============================================================
// AI RECOMMENDATIONS
// ============================================================

export const generateRecommendations =
  async (data) => {
    return request(
      "/recommendation/generate",
      {
        method: "POST",
        headers: getHeaders(false),
        body: JSON.stringify(data),
      }
    );
  };

// ============================================================
// ============================================================
// CONSULTANT APIs
// ============================================================
// ============================================================

// ------------------------------------------------------------
// CONSULTANT DASHBOARD
// ------------------------------------------------------------

export const getConsultantDashboard =
  async () => {
    return request(
      "/consultant/dashboard",
      {
        method: "GET",
        headers: getHeaders(true),
      }
    );
  };

// ------------------------------------------------------------
// CONSULTANT FARMERS
// ------------------------------------------------------------
// Your existing backend already exposes:
// GET /chat/farmers

export const getConsultantFarmers =
  async () => {
    return request(
      "/chat/farmers",
      {
        method: "GET",
        headers: getHeaders(true),
      }
    );
  };

// Alias used by Farmer Management page

export const getFarmers =
  getConsultantFarmers;

// ------------------------------------------------------------
// CONSULTANT CONSULTATIONS
// ------------------------------------------------------------

export const getConsultantConsultations =
  async () => {
    return request(
      "/consultant/consultations",
      {
        method: "GET",
        headers: getHeaders(true),
      }
    );
  };

// Alias used by Consultations page

export const getConsultations =
  getConsultantConsultations;

// ------------------------------------------------------------
// PENDING CONSULTATIONS
// ------------------------------------------------------------

export const getPendingConsultations =
  async () => {
    return request(
      "/chat/pending",
      {
        method: "GET",
        headers: getHeaders(true),
      }
    );
  };

// ------------------------------------------------------------
// CONSULTANT ANALYTICS
// ------------------------------------------------------------

export const getConsultantAnalytics = async () => {
  return request(
    "/consultant/analytics",
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );
};

// ------------------------------------------------------------
// CONSULTATION / CHAT MESSAGE
// ------------------------------------------------------------

export const getChatConversations =
  async () => {
    return request(
      "/chat/conversations",
      {
        method: "GET",
        headers: getHeaders(true),
      }
    );
  };

export const getConversationMessages =
  async (conversationId) => {
    return request(
      `/chat/conversations/${encodeURIComponent(
        conversationId
      )}/messages`,
      {
        method: "GET",
        headers: getHeaders(true),
      }
    );
  };
  // ------------------------------------------------------------
// MARK CONVERSATION AS READ
// ------------------------------------------------------------

export const markConversationAsRead =
  async (conversationId) => {
    return request(
      `/chat/conversations/${encodeURIComponent(
        conversationId
      )}/read`,
      {
        method: "PUT",
        headers: getHeaders(true),
      }
    );
  };

export const sendChatMessage =
  async (
    conversationId,
    message
  ) => {
    return request(
      `/chat/conversations/${encodeURIComponent(
        conversationId
      )}/messages`,
      {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({
          message,
        }),
      }
    );
  };

// ------------------------------------------------------------
// CONSULTANT SEND MESSAGE
// ------------------------------------------------------------

export const sendConsultationMessage =
  async (
    conversationId,
    message
  ) => {
    return sendChatMessage(
      conversationId,
      message
    );
  };

// ============================================================
// CONSULTANT NOTES
// ============================================================
// IMPORTANT:
// Your pasted API did not show an existing Notes endpoint.
// This uses /consultant/notes.
// If your FastAPI backend has a different Notes route,
// change ONLY this constant.

// ================= CONSULTANT NOTES =================

export const getConsultantNotes = async () => {
  return request("/consultant/notes", {
    method: "GET",
    headers: getHeaders(true),
  });
};

export const createConsultantNote = async (title, content) => {
  return request("/consultant/notes", {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify({
      title,
      content,
    }),
  });
};

export const updateConsultantNote = async (noteId, title, content) => {
  return request(`/consultant/notes/${noteId}`, {
    method: "PUT",
    headers: getHeaders(true),
    body: JSON.stringify({
      title,
      content,
    }),
  });
};

export const deleteConsultantNote = async (noteId) => {
  return request(`/consultant/notes/${noteId}`, {
    method: "DELETE",
    headers: getHeaders(true),
  });
};

// ============================================================
// FARMER MANAGEMENT - OPTIONAL CREATE
// ============================================================

export const createFarmer =
  async (farmerData) => {
    return request(
      "/chat/farmers",
      {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(
          farmerData
        ),
      }
    );
  };
// ============================================================
// PREDICTION REVIEWS
// ============================================================

export const getPredictionReviews = async () => {
  return request(
    "/prediction-reviews/",
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );
};


// ============================================================
// GET SINGLE PREDICTION REVIEW
// ============================================================

export const getPredictionReview = async (
  predictionId
) => {
  return request(
    `/prediction-reviews/${encodeURIComponent(
      predictionId
    )}`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );
};


// ============================================================
// SAVE PREDICTION REVIEW
// ============================================================

export const reviewPrediction = async (
  predictionId,
  status,
  comment
) => {
  return request(
    `/prediction-reviews/${encodeURIComponent(
      predictionId
    )}/review`,
    {
      method: "PUT",

      headers: getHeaders(true),

      body: JSON.stringify({
        status,
        comment: comment || null,
      }),
    }
  );
};


// ============================================================
// DELETE PREDICTION REVIEW
// ============================================================

export const deletePredictionReview = async (
  predictionId
) => {
  return request(
    `/prediction-reviews/${encodeURIComponent(
      predictionId
    )}/review`,
    {
      method: "DELETE",
      headers: getHeaders(true),
    }
  );
};
// ============================================================
// CONSULTANT ALERTS
// ============================================================

// ------------------------------------------------------------
// GET ALL ALERTS
// ------------------------------------------------------------

export const getConsultantAlerts = async () => {
  return request(
    "/consultant/alerts/",
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );
};


// ------------------------------------------------------------
// GET UNREAD ALERT COUNT
// ------------------------------------------------------------

export const getConsultantUnreadAlertCount = async () => {
  return request(
    "/consultant/alerts/unread-count",
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );
};


// ------------------------------------------------------------
// MARK ONE ALERT AS READ
// ------------------------------------------------------------

export const markConsultantAlertAsRead = async (
  alertId
) => {
  return request(
    `/consultant/alerts/${encodeURIComponent(
      alertId
    )}/read`,
    {
      method: "PUT",
      headers: getHeaders(true),
    }
  );
};


// ------------------------------------------------------------
// MARK ALL ALERTS AS READ
// ------------------------------------------------------------

export const markAllConsultantAlertsAsRead = async () => {
  return request(
    "/consultant/alerts/read-all",
    {
      method: "PUT",
      headers: getHeaders(true),
    }
  );
};


// ------------------------------------------------------------
// DELETE ALERT
// ------------------------------------------------------------

export const deleteConsultantAlert = async (
  alertId
) => {
  return request(
    `/consultant/alerts/${encodeURIComponent(
      alertId
    )}`,
    {
      method: "DELETE",
      headers: getHeaders(true),
    }
  );
};


// ------------------------------------------------------------
// CREATE ALERT
// ------------------------------------------------------------

export const createConsultantAlert = async (
  alertData
) => {
  return request(
    "/consultant/alerts/",
    {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(alertData),
    }
  );
};
// ============================================================
// API OBJECT
// ============================================================

export const api = {

  // Authentication
  loginUser,

  // User
  getCurrentUser,
  updateCurrentUser,
  uploadProfileImage,
  deleteProfileImage,

  // Dataset
  getDatasetSummary,
  getCropData,
  getSoilData,
  getRainfallData,
  getTemperatureData,
  getPesticideData,

  // Dataset analytics
  getCropAnalytics,
  getSoilAnalytics,
  getRainfallAnalytics,
  getTemperatureAnalytics,
  getPesticideAnalytics,

  // Prediction
  predictCropYield,
  getPredictionHistory,

  // Risk
  assessFarmRisk,

  // Weather
  getWeatherForecast,

  // Soil
  analyzeSoil,

  // Recommendations
  generateRecommendations,

  // Consultant dashboard
  getConsultantDashboard,

  // Consultant farmers
  getConsultantFarmers,
  getFarmers,
  createFarmer,

  // Consultant consultations
  getConsultantConsultations,
  getConsultations,
  getPendingConsultations,
  sendConsultationMessage,

  // Consultant analytics
  getConsultantAnalytics,
  

  // Consultant profile
  getConsultantProfile,
  updateConsultantProfile,

  // Prediction Reviews
  getPredictionReviews,
  getPredictionReview,
  reviewPrediction,
  deletePredictionReview,

  // Consultant Alerts
  getConsultantAlerts,
  getConsultantUnreadAlertCount,
  markConsultantAlertAsRead,
  markAllConsultantAlertsAsRead,
  deleteConsultantAlert,
  createConsultantAlert, 

  // Consultant notes
  getConsultantNotes,
  createConsultantNote,
  updateConsultantNote,
  deleteConsultantNote,

  // Chat
  getChatConversations,
  getConversationMessages,
  sendChatMessage,
  markConversationAsRead

  
};

export default api;