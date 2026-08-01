import api from "./api";

export const predictYield = async (data) => {
  const response = await api.post("/prediction/predict", data);
  return response.data;
};