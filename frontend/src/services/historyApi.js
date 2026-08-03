import axios from "axios";

const API = "http://127.0.0.1:8000/history";


// ===============================
// Get All Prediction History
// ===============================
export const getHistory = async () => {
  const response = await axios.get(API);
  return response.data;
};


// ===============================
// Get Single Prediction
// ===============================
export const getHistoryById = async (id) => {
  const response = await axios.get(`${API}/${id}`);
  return response.data;
};


// ===============================
// Delete Prediction
// ===============================
export const deleteHistory = async (id) => {
  const response = await axios.delete(`${API}/${id}`);
  return response.data;
};


// ===============================
// Search Prediction
// Backend Route:
// GET /history/search?crop=Rice
// ===============================
export const searchHistory = async (crop) => {
  const response = await axios.get(
    `${API}/search?crop=${crop}`
  );

  return response.data;
};


// ===============================
// Filter Prediction
// Backend Route:
// GET /history/filter?area=Brazil
// ===============================
export const filterHistory = async (area) => {
  const response = await axios.get(
    `${API}/filter?area=${area}`
  );

  return response.data;
};


// ===============================
// Export PDF
// (We'll implement later)
// ===============================
export const exportPDF = async () => {
  const response = await axios.get(
    `${API}/export/pdf`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};


// ===============================
// Export Excel
// (We'll implement later)
// ===============================
export const exportExcel = async () => {
  const response = await axios.get(
    `${API}/export/excel`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};