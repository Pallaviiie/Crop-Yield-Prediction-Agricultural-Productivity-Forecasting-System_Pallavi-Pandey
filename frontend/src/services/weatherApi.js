import axios from "axios";

const API = import.meta.env.VITE_API_URL;
export const getWeather = async (city) => {
  const response = await axios.get(
    `${API}/weather/current?city=${city}`
  );

  return response.data;
};