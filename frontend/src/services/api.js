const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// ==========================================
// TOKEN
// ==========================================

const getToken = () => {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("token")
  );
};

// ==========================================
// HEADERS
// ==========================================

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

// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (email, password) => {
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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Invalid email or password."
    );
  }

  return data;
};

// ==========================================
// CURRENT USER / FARMER PROFILE
// ==========================================

export const getCurrentUser = async () => {
  const response = await fetch(
    `${API_URL}/users/me`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Unable to fetch farmer profile"
    );
  }

  console.log("GET CURRENT USER RESPONSE:", data);

  // Support all common backend response structures
  return (
    data?.profile ||
    data?.user ||
    data?.data?.profile ||
    data?.data?.user ||
    data
  );
};


export const updateCurrentUser = async (profileData) => {
  const response = await fetch(
    `${API_URL}/users/me`,
    {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Unable to update farmer profile"
    );
  }

  console.log("UPDATE CURRENT USER RESPONSE:", data);

  // Normalize backend response
  return (
    data?.profile ||
    data?.user ||
    data?.data?.profile ||
    data?.data?.user ||
    data
  );
};
// ==========================================
// PROFILE IMAGE UPLOAD
// ==========================================

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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        "Failed to upload profile image"
    );
  }

  return data;
};

// ==========================================
// DATASET API
// ==========================================

export const getDatasetSummary = async () => {
  const response = await fetch(`${API_URL}/datasets/summary`);

  if (!response.ok) {
    throw new Error("Failed to fetch dataset summary");
  }

  return response.json();
};

export const getCropData = async () => {
  const response = await fetch(`${API_URL}/datasets/crop`);

  if (!response.ok) {
    throw new Error("Failed to fetch crop data");
  }

  return response.json();
};

export const getSoilData = async () => {
  const response = await fetch(`${API_URL}/datasets/soil`);

  if (!response.ok) {
    throw new Error("Failed to fetch soil data");
  }

  return response.json();
};

export const getRainfallData = async () => {
  const response = await fetch(`${API_URL}/datasets/rainfall`);

  if (!response.ok) {
    throw new Error("Failed to fetch rainfall data");
  }

  return response.json();
};

export const getTemperatureData = async () => {
  const response = await fetch(`${API_URL}/datasets/temperature`);

  if (!response.ok) {
    throw new Error("Failed to fetch temperature data");
  }

  return response.json();
};

export const getPesticideData = async () => {
  const response = await fetch(`${API_URL}/datasets/pesticides`);

  if (!response.ok) {
    throw new Error("Failed to fetch pesticide data");
  }

  return response.json();
};

// ==========================================
// ANALYTICS API
// ==========================================

export const getCropAnalytics = async () => {
  const response = await fetch(
    `${API_URL}/datasets/analytics/crop`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch crop analytics");
  }

  return response.json();
};

export const getSoilAnalytics = async () => {
  const response = await fetch(
    `${API_URL}/datasets/analytics/soil`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch soil analytics");
  }

  return response.json();
};

export const getRainfallAnalytics = async () => {
  const response = await fetch(
    `${API_URL}/datasets/analytics/rainfall`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch rainfall analytics");
  }

  return response.json();
};

export const getTemperatureAnalytics = async () => {
  const response = await fetch(
    `${API_URL}/datasets/analytics/temperature`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch temperature analytics");
  }

  return response.json();
};

export const getPesticideAnalytics = async () => {
  const response = await fetch(
    `${API_URL}/datasets/analytics/pesticides`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pesticide analytics");
  }

  return response.json();
};

// ==========================================
// CROP YIELD PREDICTION
// ==========================================

export const predictCropYield = async (predictionData) => {
  const response = await fetch(
    `${API_URL}/prediction/predict`,
    {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(predictionData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Failed to predict crop yield"
    );
  }

  return data;
};

export const assessFarmRisk = async (riskData) => {

  const response = await fetch(
    `${API_URL}/risk-assessment/`,
    {
      method: "POST",

      headers: getHeaders(true),

      body: JSON.stringify(riskData),
    }
  );

  const data = await response.json();

  if (!response.ok) {

    throw new Error(
      data?.detail ||
      "Unable to assess farm risk."
    );

  }

  return data;
};

// ==========================================
// PREDICTION HISTORY
// ==========================================

export const getPredictionHistory = async () => {
  const response = await fetch(
    `${API_URL}/prediction/history`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Failed to fetch prediction history"
    );
  }

  return data;
};
// ==========================================
// REAL-TIME WEATHER
// ==========================================

export const getWeatherForecast = async (latitude, longitude) => {
  const response = await fetch(
    `${API_URL}/weather/forecast?latitude=${encodeURIComponent(
      latitude
    )}&longitude=${encodeURIComponent(longitude)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Failed to fetch weather forecast"
    );
  }

  return data;
};

// ============================================================
// SOIL HEALTH ANALYSIS
// ============================================================

export const analyzeSoil = async (soilData) => {
  const response = await fetch(
    `${API_URL}/soil/analyze`,
    {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(soilData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Failed to analyze soil"
    );
  }

  return data;
};

// ==========================================
// CONSULTANT DASHBOARD
// ==========================================

export const getConsultantDashboard = async () => {
  const response = await fetch(
    `${API_URL}/consultant/dashboard`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Failed to fetch consultant dashboard"
    );
  }

  return data;
};

// ==========================================
// CONSULTANT - FARMERS
// ==========================================

export const getConsultantFarmers = async () => {
  const response = await fetch(
    `${API_URL}/chat/farmers`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Failed to fetch registered farmers"
    );
  }

  return data;
};

// ==========================================
// CONSULTANT - CONSULTATIONS
// ==========================================

export const getConsultantConsultations = async () => {
  const response = await fetch(
    `${API_URL}/consultant/consultations`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Failed to fetch consultations"
    );
  }

  return data;
};
// ==========================================
// CONSULTANT - PENDING CONSULTATIONS
// ==========================================

export const getPendingConsultations = async () => {
  const response = await fetch(
    `${API_URL}/chat/pending`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Failed to fetch pending consultations"
    );
  }

  return data;
};

// ==========================================
// CONSULTANT - ANALYTICS
// ==========================================

export const getConsultantAnalytics = async () => {
  const response = await fetch(
    `${API_URL}/consultant/analytics`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Failed to fetch consultant analytics"
    );
  }

  return data;
};


// ==========================================
// CHAT
// ==========================================

export const getChatConversations = async () => {

  const response = await fetch(
    `${API_URL}/chat/conversations`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Unable to fetch conversations."
    );
  }

  return data;
};


export const getConversationMessages = async (
  conversationId
) => {

  const response = await fetch(
    `${API_URL}/chat/conversations/${conversationId}/messages`,
    {
      method: "GET",
      headers: getHeaders(true),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Unable to fetch messages."
    );
  }

  return data;
};


export const sendChatMessage = async (
  conversationId,
  message
) => {

  const response = await fetch(
    `${API_URL}/chat/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({
        message,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      "Unable to send message."
    );
  }

  return data;
};

// ==========================================
// AI CROP RECOMMENDATIONS
// ==========================================

export const generateRecommendations = async (
  data
) => {

  const response = await fetch(
    `${API_URL}/recommendation/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    }
  );


  const result =
    await response.json();


  if (!response.ok) {

    throw new Error(
      result.detail ||
      "Unable to generate AI recommendations."
    );

  }


  return result;

};

// ==========================================
// API OBJECT
// ==========================================

export const api = {

  // Authentication
  loginUser,

  // Profile
  getCurrentUser,
  updateCurrentUser,
  uploadProfileImage,

  // Dataset
  getDatasetSummary,
  getCropData,
  getSoilData,
  getRainfallData,
  getTemperatureData,
  getPesticideData,

  // Dataset Analytics
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

  generateRecommendations,

  // Consultant
  getConsultantDashboard,
  getConsultantFarmers,
  getConsultantConsultations,
  getPendingConsultations,
  getConsultantAnalytics,


  // Chat
  getChatConversations,
  getConversationMessages,
  sendChatMessage,
};