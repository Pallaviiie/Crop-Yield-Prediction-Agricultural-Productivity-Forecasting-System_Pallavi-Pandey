import { CheckCircle2 } from "lucide-react";

const recommendations = [
  "Rice cultivation is highly recommended.",
  "Apply Nitrogen fertilizer after 7 days.",
  "Rain expected this weekend.",
  "Maintain irrigation every 3 days.",
  "Soil pH is ideal for current crop.",
];

export default function Recommendation() {
  return (
<div className="bg-white rounded-2xl shadow-md p-6 h-full">
    
      <h2 className="text-xl font-bold text-green-700 mb-6">
        AI Recommendations
      </h2>

      <div className="space-y-4">

        {recommendations.map((item, index) => (

          <div
            key={index}
            className="flex items-start gap-3"
          >

            <CheckCircle2
              className="text-green-600 mt-1"
              size={20}
            />

            <p>{item}</p>

          </div>

        ))}

      </div>

    </div>
  );
}