import { useState } from "react";
import {
  Thermometer,
  CloudRain,
  FlaskConical,
  MapPin,
  Wheat,
} from "lucide-react";

import { predictYield } from "../../services/predictionApi";
import { getWeather } from "../../services/weatherApi";

export default function CropPrediction() {
  const [prediction, setPrediction] = useState(null);
  const [weather, setWeather] = useState(null);

  const [formData, setFormData] = useState({
    area: "",
    item: "",
    year: "",
    average_rain_fall_mm_per_year: "",
    pesticides_tonnes: "",
    avg_temp: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePredict = async () => {
    try {
      console.log("Sending:", formData);

      // Get Weather
      const weatherData = await getWeather(formData.area);

      console.log("Weather:", weatherData);

      setWeather(weatherData);

      // Predict Yield
      const response = await predictYield({
        ...formData,
        average_rain_fall_mm_per_year:
          weatherData.rainfall ||
          formData.average_rain_fall_mm_per_year,

        avg_temp: weatherData.temperature,
      });

      console.log("Prediction:", response);

      setPrediction(response);
    } catch (err) {
      console.log("Status:", err.response?.status);
      console.log("Backend Error:", err.response?.data);
      console.log(err);

      alert("Prediction Failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <h2 className="text-2xl font-bold text-green-700 mb-6">
        🌾 Crop Yield Prediction
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <Input
          icon={<MapPin size={18} />}
          label="Area"
          name="area"
          value={formData.area}
          onChange={handleChange}
          placeholder="Brazil"
        />

        <Input
          icon={<Wheat size={18} />}
          label="Crop"
          name="item"
          value={formData.item}
          onChange={handleChange}
          placeholder="Rice, paddy"
        />

        <Input
          icon={<FlaskConical size={18} />}
          label="Year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="2026"
        />

        <Input
          icon={<CloudRain size={18} />}
          label="Rainfall (mm)"
          name="average_rain_fall_mm_per_year"
          value={formData.average_rain_fall_mm_per_year}
          onChange={handleChange}
          placeholder="1200"
        />

        <Input
          icon={<FlaskConical size={18} />}
          label="Pesticides (tonnes)"
          name="pesticides_tonnes"
          value={formData.pesticides_tonnes}
          onChange={handleChange}
          placeholder="120"
        />

        <Input
          icon={<Thermometer size={18} />}
          label="Temperature (°C)"
          name="avg_temp"
          value={formData.avg_temp}
          onChange={handleChange}
          placeholder="25"
        />

      </div>

      <button
        onClick={handlePredict}
        className="mt-6 w-full py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
      >
        Predict Yield
      </button>

      {/* WEATHER CARD */}

      {weather && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">

          <h3 className="text-xl font-bold text-blue-700 mb-4">
            🌤 Current Weather
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <p>
              🌡 Temperature: <b>{weather.temperature} °C</b>
            </p>

            <p>
              💧 Humidity: <b>{weather.humidity}%</b>
            </p>

            <p>
              🌧 Rainfall: <b>{weather.rainfall} mm</b>
            </p>

            <p>
              💨 Wind Speed: <b>{weather.wind_speed} m/s</b>
            </p>

            <p>
              ☁ Condition: <b>{weather.condition}</b>
            </p>

            <p>
              📍 City: <b>{weather.city}</b>
            </p>

          </div>

        </div>
      )}

      {/* PREDICTION CARD */}

      {prediction && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5">

          <h3 className="text-xl font-bold text-green-700 mb-4">
            🌾 Prediction Result
          </h3>

          <div className="space-y-3">

            <p>
              🌾 <b>Predicted Yield:</b>{" "}
              {prediction.predicted_yield} hg/ha
            </p>

            <p>
              📊 <b>Confidence:</b>{" "}
              {prediction.confidence}%
            </p>

            <p>
              ⭐ <b>Yield Quality:</b>{" "}
              {prediction.stars} {prediction.category}
            </p>

            <p>
              🤖 <b>Recommendation:</b>{" "}
              {prediction.recommendation}
            </p>

            <p>
              💧 <b>Irrigation Tip:</b>{" "}
              {prediction.irrigation_tip}
            </p>

            <p>
              🌱 <b>Fertilizer Tip:</b>{" "}
              {prediction.fertilizer_tip}
            </p>

            <p>
              🌾 <b>Soil Tip:</b>{" "}
              {prediction.soil_tip}
            </p>

            <p>
              🐛 <b>Pest Risk:</b>{" "}
              {prediction.pest_risk}
            </p>

            <p>
              📈 <b>Expected Production:</b>{" "}
              {prediction.production}
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

function Input({
  label,
  placeholder,
  icon,
  name,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="text-sm font-medium text-gray-600">
        {label}
      </label>

      <div className="flex items-center mt-2 border rounded-xl px-3 h-11">

        <div className="text-green-600">
          {icon}
        </div>

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="ml-2 flex-1 outline-none text-sm"
        />

      </div>

    </div>
  );
}