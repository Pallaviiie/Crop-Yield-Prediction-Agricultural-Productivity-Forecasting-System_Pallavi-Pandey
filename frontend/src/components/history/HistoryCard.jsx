import {
  MapPin,
  Wheat,
  Calendar,
  TrendingUp,
  Trash2,
  Eye,
} from "lucide-react";

export default function HistoryCard({
  history,
  onDelete,
  onView,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-green-100 p-5 hover:shadow-xl transition">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <div>
          <h2 className="text-xl font-bold text-green-700">
             {history.crop}
          </h2>

          <p className="text-sm text-gray-500">
            {new Date(history.created_at).toLocaleDateString()}
          </p>
        </div>

       

      </div>

      {/* Information */}

      <div className="space-y-3">

        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-green-600" />
          <span>{history.area}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-green-600" />
          <span>{history.year}</span>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-green-600" />
          <span className="font-semibold text-green-700">
            {history.predicted_yield.toFixed(2)} hg/ha
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Wheat size={18} className="text-green-600" />
          <span>{history.recommendation}</span>
        </div>

      </div>

      {/* Footer Buttons */}

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={() => onView(history)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Eye size={18} />
          View
        </button>

        <button
          onClick={() => onDelete(history.id)}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          <Trash2 size={18} />
          Delete
        </button>

      </div>

    </div>
  );
}