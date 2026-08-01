import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", yield: 20 },
  { month: "Feb", yield: 25 },
  { month: "Mar", yield: 35 },
  { month: "Apr", yield: 40 },
  { month: "May", yield: 55 },
  { month: "Jun", yield: 48 },
];

export default function YieldChart() {
  return (
<div className="bg-white rounded-2xl shadow-md p-6 h-[360px]">
      <h2 className="text-xl font-bold text-green-700">
        Yield Trend
      </h2>

      <ResponsiveContainer width="100%" height={230}>

        <LineChart data={data}>

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="yield"
            stroke="#16a34a"
            strokeWidth={4}
            
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}