import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "1 Jul", value: 250 },
  { day: "5 Jul", value: 480 },
  { day: "10 Jul", value: 410 },
  { day: "15 Jul", value: 600 },
  { day: "20 Jul", value: 520 },
  { day: "25 Jul", value: 720 },
  { day: "31 Jul", value: 830 },
];

export default function PredictionChart() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="font-semibold text-xl">
            Predictions Overview
          </h2>

          <p className="text-gray-500 text-sm">
            Monthly Crop Yield Predictions
          </p>

        </div>

        <select className="border rounded-lg px-3 py-2">

          <option>This Month</option>

          <option>Last Month</option>

        </select>

      </div>

      <ResponsiveContainer width="100%" height={320}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#16a34a"
            strokeWidth={4}
            dot={{ r: 5 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}