const API_BASE_URL = "http://127.0.0.1:8000";

export const predictCropYield = async (predictionData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/prediction/predict`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(predictionData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || "Prediction failed"
      );
    }

    return data;

  } catch (error) {

    console.error(
      "Prediction API Error:",
      error
    );

    throw error;
  }
};