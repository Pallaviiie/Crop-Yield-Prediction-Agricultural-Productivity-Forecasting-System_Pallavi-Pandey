import { Eye, Download } from "lucide-react";

const history = [
  {
    crop: "Rice",
    district: "Lucknow",
    yield: "6.8 Ton/Ha",
    confidence: "96%",
    date: "30 Jul 2026",
  },
  {
    crop: "Wheat",
    district: "Ludhiana",
    yield: "5.3 Ton/Ha",
    confidence: "93%",
    date: "28 Jul 2026",
  },
  {
    crop: "Maize",
    district: "Patna",
    yield: "4.2 Ton/Ha",
    confidence: "91%",
    date: "25 Jul 2026",
  },
];

export default function PredictionTable() {
  return (
<div className="bg-white rounded-2xl shadow-md p-6 h-full">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl font-bold text-green-700">
          Recent Predictions
        </h2>

        <button className="text-green-700 font-semibold hover:text-green-800">
  View All →
</button>

      </div>
<div className="overflow-x-auto rounded-xl border border-gray-100">

<table className="min-w-full text-sm">

  <thead className="bg-green-50 text-green-700">

    <tr>

      <th className="text-left py-3 px-4">Crop</th>

      <th className="text-left py-3 px-4">Location</th>

      <th className="text-left py-3 px-4">Yield</th>

      <th className="text-left py-3 px-4">Confidence</th>

      <th className="text-left py-3 px-4">Date</th>

      <th className="text-left py-3 px-4">Action</th>

    </tr>

  </thead>

  <tbody>

    {history.map((item, index) => (

      <tr
        key={index}
        className="border-b last:border-0 hover:bg-green-50 transition"
      >

        <td className="py-4 px-4 font-semibold whitespace-nowrap">
          🌾 {item.crop}
        </td>

        <td className="px-4 whitespace-nowrap">
          {item.district}
        </td>

       <td className="px-4 whitespace-nowrap font-medium text-green-700">
          {item.yield}
        </td>

        <td className="px-4 whitespace-nowrap">

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            {item.confidence}
          </span>

        </td>

        <td className="px-4 whitespace-nowrap">
          {item.date}
        </td>

        <td className="px-4">

          <div className="flex gap-3">

            <button className="p-2 rounded-lg hover:bg-green-100">

              <Eye
                size={17}
                className="text-green-700"
              />

            </button>

            <button className="p-2 rounded-lg hover:bg-blue-100">

              <Download
                size={17}
                className="text-blue-700"
              />

            </button>

          </div>

        </td>

      </tr>

    ))}

  </tbody>

</table>

</div>
    </div>
  );
}