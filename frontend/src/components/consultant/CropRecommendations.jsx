import { Sprout, Wheat, Leaf } from "lucide-react";

const crops = [
  {
    name: "Rice",
    text: "Excellent weather conditions. Increase irrigation slightly.",
    level: "High",
    color: "bg-red-100 text-red-600",
    icon: Sprout,
  },
  {
    name: "Maize",
    text: "Suitable for cultivation with balanced fertilizer.",
    level: "Medium",
    color: "bg-yellow-100 text-yellow-700",
    icon: Wheat,
  },
  {
    name: "Cotton",
    text: "Monitor pest activity during the next week.",
    level: "Low",
    color: "bg-green-100 text-green-700",
    icon: Leaf,
  },
];

export default function CropRecommendations() {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 h-full flex flex-col">

      <div className="flex justify-between mb-5">

        <div>
          <h2 className="text-3xl font-bold">
            AI Crop Recommendations
          </h2>

          <p className="text-gray-500">
            Suggested actions for farmers
          </p>
        </div>

      </div>

      <div className="space-y-5 flex-1">

        {crops.map((crop, index) => {

          const Icon = crop.icon;

          return (
            <div
              key={index}
              className="border rounded-2xl p-5 flex justify-between items-start"
            >

              <div className="flex gap-4">

                <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center">
                  <Icon className="text-green-600"/>
                </div>

                <div>

                  <h3 className="font-bold text-2xl">
                    {crop.name}
                  </h3>

                  <p className="text-gray-500">
                    {crop.text}
                  </p>

                </div>

              </div>

              <span className={`px-4 py-1 rounded-full font-semibold ${crop.color}`}>
                {crop.level}
              </span>

            </div>
          );
        })}

      </div>

      <button className="mt-6 bg-green-600 text-white rounded-2xl py-4 text-lg font-semibold hover:bg-green-700">
        View All Recommendations
      </button>

    </div>
  );
}