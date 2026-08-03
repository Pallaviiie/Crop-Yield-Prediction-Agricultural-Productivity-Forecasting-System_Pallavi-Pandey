import {
  Users,
  Map,
  Sprout,
  Target,
  FileText,
} from "lucide-react";

const cards = [
  {
    title: "Farmers",
    value: "285",
    icon: Users,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Fields",
    value: "642",
    icon: Map,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Predictions",
    value: "1,942",
    icon: Sprout,
    color: "bg-lime-100 text-lime-600",
  },
  {
    title: "Success Rate",
    value: "96%",
    icon: Target,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Reports",
    value: "318",
    icon: FileText,
    color: "bg-orange-100 text-orange-600",
  },
];

export default function ConsultantStats() {
  return (
    <div className="grid grid-cols-5 gap-5">

      {cards.map((card, index) => {

        const Icon = card.icon;

        return (

          <div
            key={index}
            className="rounded-2xl bg-gradient-to-br from-white to-green-50 p-5 shadow-sm hover:shadow-lg transition"
          >

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.color}`}
            >

              <Icon size={24} />

            </div>

            <p className="text-gray-500 text-sm">
              {card.title}
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {card.value}
            </h2>

          </div>

        );

      })}

    </div>
  );
}