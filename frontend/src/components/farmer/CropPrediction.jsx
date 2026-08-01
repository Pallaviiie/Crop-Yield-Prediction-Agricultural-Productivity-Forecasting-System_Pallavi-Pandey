import { useState } from "react";
import { Thermometer, CloudRain, FlaskConical, MapPin, Wheat } from "lucide-react";
import { predictYield } from "../../services/predictionApi";

export default function CropPrediction() {
  const [prediction, setPrediction] = useState(null);

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
  console.log("Sending Data:", formData);

  try {
    const response = await predictYield(formData);
    console.log("Response:", response);
    setPrediction(response);
  } catch (err) {
  console.log("Status:", err.response?.status);
  console.log("Backend Error:");
console.dir(err.response?.data, { depth: null });

alert(JSON.stringify(err.response?.data, null, 2));
  console.log("Full Error:", err);

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
          placeholder="India"
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

      {prediction && (
  <div className="mt-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200 shadow-lg p-6">

    <h3 className="text-2xl font-bold text-green-700 mb-5">
      🌾 Prediction Result
    </h3>

    <div className="grid md:grid-cols-2 gap-6">

      <div>

        <p className="text-gray-500">Predicted Yield</p>

        <h2 className="text-4xl font-bold text-green-700">
          {prediction.predicted_yield.toFixed(2)}
        </h2>

        <p className="text-gray-500">
          hg/ha
        </p>

        <div className="mt-5">

          <p className="text-gray-500">
            Yield Quality
          </p>

          <h3 className="text-xl font-bold text-yellow-500">
            {prediction.stars}
          </h3>

          <p className="font-semibold">
            {prediction.category}
          </p>

        </div>

        <div className="mt-5">

          <p className="text-gray-500">
            Confidence
          </p>

          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">

            <div
              className="bg-green-600 h-4 rounded-full"
              style={{
                width: `${prediction.confidence}%`,
              }}
            />

          </div>

          <p className="mt-2 font-semibold">
            {prediction.confidence}%
          </p>

        </div>

      </div>

      <div>

        <h4 className="font-bold text-lg text-green-700 mb-4">
          🤖 AI Recommendation
        </h4>

        <ul className="space-y-3 text-gray-700">

          <li>✅ {prediction.recommendation}</li>

          <li>💧 {prediction.irrigation_tip}</li>

          <li>🌱 {prediction.fertilizer_tip}</li>

          <li>🌾 {prediction.soil_tip}</li>

          <li>🐛 Pest Risk: {prediction.pest_risk}</li>

          <li>📈 Expected Production: {prediction.production}</li>

        </ul>

      </div>

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