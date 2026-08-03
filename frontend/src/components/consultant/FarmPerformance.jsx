import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
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
  { month: "Dec", yield: 105 },
];

export default function FarmPerformance() {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 h-full">

      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold">Farm Performance</h2>
          <p className="text-gray-500">
            Monthly crop performance
          </p>
        </div>

        <select className="border rounded-xl px-3 py-2">
          <option>This Year</option>
        </select>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
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
              dot={{
                r:5,
                fill:"#fff",
                stroke:"#16a34a",
                strokeWidth:3
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}