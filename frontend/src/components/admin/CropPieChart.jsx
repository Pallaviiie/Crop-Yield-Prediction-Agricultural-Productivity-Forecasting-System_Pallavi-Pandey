import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Rice", value: 35 },
  { name: "Wheat", value: 25 },
  { name: "Maize", value: 20 },
  { name: "Cotton", value: 10 },
  { name: "Others", value: 10 },
];

const COLORS = [
  "#16a34a",
  "#84cc16",
  "#fbbf24",
  "#60a5fa",
  "#d1d5db",
];

export default function CropPieChart() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="flex justify-between items-center">

        <h2 className="font-semibold text-xl">
          Crop Distribution
        </h2>

        <select className="border rounded-lg px-3 py-2">

          <option>This Month</option>

        </select>

      </div>

      <ResponsiveContainer width="100%" height={320}>

        <PieChart>

          <Pie
            data={data}
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
            dataKey="value"
          >

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}

          </Pie>

        </PieChart>

      </ResponsiveContainer>

      <div className="space-y-2">

        {data.map((item, index) => (

          <div
            key={index}
            className="flex justify-between"
          >

            <div className="flex items-center gap-2">

              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: COLORS[index],
                }}
              />

              {item.name}

            </div>

            <span>{item.value}%</span>

          </div>

        ))}

      </div>

    </div>
  );
}