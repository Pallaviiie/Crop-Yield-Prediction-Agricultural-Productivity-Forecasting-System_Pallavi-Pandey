import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", yield: 40 },
  { month: "Feb", yield: 55 },
  { month: "Mar", yield: 62 },
  { month: "Apr", yield: 58 },
  { month: "May", yield: 74 },
  { month: "Jun", yield: 82 },
  { month: "Jul", yield: 78 },
  { month: "Aug", yield: 88 },
  { month: "Sep", yield: 94 },
  { month: "Oct", yield: 90 },
  { month: "Nov", yield: 98 },
  { month: "Dec", yield: 104 },
];

export default function FarmOverviewChart() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            Farm Performance
          </h2>

          <p className="text-gray-500">
            Crop yield trend throughout the year
          </p>

        </div>

        <select className="border rounded-xl px-4 py-2 outline-none">
          <option>2026</option>
          <option>2025</option>
          <option>2024</option>
        </select>

      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="yield"
            stroke="#16a34a"
            strokeWidth={4}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}