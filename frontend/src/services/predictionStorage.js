// ============================================================
// LATEST PREDICTION STORAGE
// ============================================================

const LATEST_PREDICTION_KEY = "latestPrediction";

// ============================================================
// SAVE
// ============================================================

export const saveLatestPrediction = (prediction) => {
  try {
    localStorage.setItem(
      LATEST_PREDICTION_KEY,
      JSON.stringify(prediction)
    );
  } catch (error) {
    console.error("Unable to save prediction:", error);
  }
};

// ============================================================
// GET
// ============================================================

export const getLatestPrediction = () => {
  try {
    const saved = localStorage.getItem(
      LATEST_PREDICTION_KEY
    );

    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error("Unable to load prediction:", error);
    return null;
  }
};

// ============================================================
// CLEAR
// ============================================================

export const clearLatestPrediction = () => {
  try {
    localStorage.removeItem(
      LATEST_PREDICTION_KEY
    );
  } catch (error) {
    console.error("Unable to clear prediction:", error);
  }
};