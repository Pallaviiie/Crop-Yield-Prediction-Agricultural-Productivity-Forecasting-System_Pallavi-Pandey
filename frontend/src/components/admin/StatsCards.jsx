import {
  Users,
  BarChart3,
  Sprout,
  Target,
} from "lucide-react";

const cards = [
  {
    title: "Total Users",
    value: "1,245",
    growth: "+18%",
    icon: Users,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Total Predictions",
    value: "3,678",
    growth: "+23%",
    icon: BarChart3,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Crops Analyzed",
    value: "24",
    growth: "+8%",
    icon: Sprout,
    color: "bg-lime-100 text-lime-600",
  },
  {
    title: "System Accuracy",
    value: "96.4%",
    growth: "+5%",
    icon: Target,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-6 mt-8">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold mt-2 text-gray-900">
                  {card.value}
                </h2>

                <p className="text-green-600 text-sm font-semibold mt-3">
                  ↑ {card.growth} from last month
                </p>
              </div>

              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${card.color}`}
              >
                <Icon size={30} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}