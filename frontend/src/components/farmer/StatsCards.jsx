import {
  Sprout,
  Wheat,
  CloudSun,
  Cpu,
} from "lucide-react";

const stats = [
  {
    title: "Total Predictions",
    value: "158",
    subtitle: "+12% from last month",
    color: "bg-green-100",
    icon: <Sprout className="text-green-700" w-14 h-14 />,
  },
  {
    title: "Average Yield",
    value: "7.8 Tons",
    subtitle: "+8% from last month",
    color: "bg-yellow-100",
    icon: <Wheat className="text-yellow-600" w-14 h-14 />,
  },
  {
    title: "Weather Score",
    value: "92%",
    subtitle: "Good Conditions",
    color: "bg-blue-100",
    icon: <CloudSun className="text-blue-600" w-14 h-14 />,
  },
  {
    title: "AI Accuracy",
    value: "96%",
    subtitle: "High Precision",
    color: "bg-purple-100",
    icon: <Cpu className="text-purple-600" w-14 h-14 />,
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-6 mt-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-5"
        >
          <div className="flex items-center justify-between">

            <div>
              <p className="text-gray-500">{item.title}</p>

              <h2 className="text-4xl font-bold mt-2">
                {item.value}
              </h2>

              <p className="text-green-600 mt-2 text-sm">
                {item.subtitle}
              </p>
            </div>

            <div className={`${item.color} p-4 rounded-full`}>
              {item.icon}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}