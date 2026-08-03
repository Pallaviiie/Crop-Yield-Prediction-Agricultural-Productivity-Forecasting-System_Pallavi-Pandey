import axios from "axios";

const API = "http://127.0.0.1:8000";

export const getWeather = async (city) => {
  const response = await axios.get(
    `${API}/weather/current?city=${city}`
  );

  return response.data;
};