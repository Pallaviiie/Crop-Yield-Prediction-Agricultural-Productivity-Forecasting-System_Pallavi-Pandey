import { useState } from "react";
import { Thermometer, CloudRain, FlaskConical, MapPin, Wheat } from "lucide-react";
import { predictYield } from "../../services/predictionApi";

export default function CropPrediction() {
  const [prediction, setPrediction] = useState(null);

  const [formData, setFormData] = useState({
    Area: "",
    Item: "",
    Year: "",
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
      const response = await predictYield({
        ...formData,
        Year: Number(formData.Year),
        average_rain_fall_mm_per_year: Number(
          formData.average_rain_fall_mm_per_year
        ),
        pesticides_tonnes: Number(formData.pesticides_tonnes),
        avg_temp: Number(formData.avg_temp),
      });

      setPrediction(response);
    } catch (err) {
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
          name="Area"
          value={formData.Area}
          onChange={handleChange}
          placeholder="India"
        />

        <Input
          icon={<Wheat size={18} />}
          label="Crop"
          name="Item"
          value={formData.Item}
          onChange={handleChange}
          placeholder="Rice, paddy"
        />

        <Input
          icon={<FlaskConical size={18} />}
          label="Year"
          name="Year"
          value={formData.Year}
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

      {prediction && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5">

          <h3 className="text-lg font-bold text-green-700 mb-3">
            Prediction Result
          </h3>

          <p className="mb-2">
            🌾 <b>Predicted Yield:</b>{" "}
            {prediction.predicted_yield.toFixed(2)} hg/ha
          </p>

          <p className="mb-2">
            📊 <b>Confidence:</b>{" "}
            {prediction.confidence}%
          </p>

          <p>
            💡 <b>Recommendation:</b>{" "}
            {prediction.recommendation}
          </p>

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