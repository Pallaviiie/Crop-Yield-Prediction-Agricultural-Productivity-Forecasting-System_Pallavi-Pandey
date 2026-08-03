import { Trash2, Eye } from "lucide-react";

export default function HistoryTable({
  history,
  onDelete,
  onView,
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-2xl shadow-md">

      <table className="min-w-full">

        <thead className="bg-green-600 text-white">

          <tr>
            <th className="px-5 py-3 text-left">Crop</th>
            <th className="px-5 py-3 text-left">Area</th>
            <th className="px-5 py-3 text-left">Year</th>
            <th className="px-5 py-3 text-left">Yield</th>
            <th className="px-5 py-3 text-left">Recommendation</th>
            <th className="px-5 py-3 text-left">Date</th>
            <th className="px-5 py-3 text-center">Actions</th>
          </tr>

        </thead>

        <tbody>

          {history.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="text-center py-8 text-gray-500"
              >
                No prediction history found.
              </td>
            </tr>
          ) : (
            history.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-green-50 transition"
              >
                <td className="px-5 py-4 font-semibold">
                  🌾 {item.crop}
                </td>

                <td className="px-5 py-4">
                  📍 {item.area}
                </td>

                <td className="px-5 py-4">
                  {item.year}
                </td>

                <td className="px-5 py-4 text-green-700 font-bold">
                  {item.predicted_yield.toFixed(2)} hg/ha
                </td>

                <td className="px-5 py-4">
                  {item.recommendation}
                </td>

                <td className="px-5 py-4">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>

                <td className="px-5 py-4">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => onView(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}