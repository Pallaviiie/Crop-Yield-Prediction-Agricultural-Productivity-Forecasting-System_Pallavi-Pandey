import { Leaf } from "lucide-react";
export default function SoilHealth() {

  const data = [
    { name: "Nitrogen", value: 80 },
    { name: "Phosphorus", value: 60 },
    { name: "Potassium", value: 92 },
    { name: "Soil Moisture", value: 74 },
  ];

  return (
<div className="bg-white rounded-2xl shadow-md p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
  <Leaf className="w-5 h-5 text-green-600" />
  <h2 className="text-xl font-bold text-green-700">
    Soil Health
  </h2>
</div>

      {data.map((item) => (

        <div key={item.name} className="mb-5">

          <div className="flex justify-between mb-2">

            <span>{item.name}</span>

            <span>{item.value}%</span>

          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
  <div
    className="h-2 bg-green-600 rounded-full transition-all duration-500"
    style={{ width: `${item.value}%` }}
  />
</div>

        </div>

      ))}

    </div>
  );
}