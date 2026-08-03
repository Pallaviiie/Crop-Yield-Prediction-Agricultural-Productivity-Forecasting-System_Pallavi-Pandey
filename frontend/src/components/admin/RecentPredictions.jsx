const predictions = [
  {
    id: "#1025",
    farmer: "Rahul Sharma",
    crop: "Rice",
    yield: "8.2 Tons/ha",
    confidence: "97%",
    date: "03 Aug 2026",
    status: "Completed",
  },
  {
    id: "#1024",
    farmer: "Priya Verma",
    crop: "Wheat",
    yield: "6.5 Tons/ha",
    confidence: "95%",
    date: "02 Aug 2026",
    status: "Completed",
  },
  {
    id: "#1023",
    farmer: "Ramesh Patel",
    crop: "Maize",
    yield: "7.8 Tons/ha",
    confidence: "94%",
    date: "01 Aug 2026",
    status: "Completed",
  },
  {
    id: "#1022",
    farmer: "Anjali Singh",
    crop: "Cotton",
    yield: "5.7 Tons/ha",
    confidence: "92%",
    date: "31 Jul 2026",
    status: "Completed",
  },
];

export default function RecentPredictions() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="flex justify-between mb-5">

        <h2 className="text-xl font-semibold">
          Recent Predictions
        </h2>

        <button className="text-green-600 font-medium">
          View All
        </button>

      </div>

      <table className="w-full">

        <thead className="text-gray-500">

          <tr>
            <th className="text-left py-3">ID</th>
            <th className="text-left">Farmer</th>
            <th>Crop</th>
            <th>Yield</th>
            <th>Confidence</th>
            <th>Date</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {predictions.map((item) => (

            <tr
              key={item.id}
              className="border-t"
            >
              <td className="py-4">{item.id}</td>
              <td>{item.farmer}</td>
              <td>{item.crop}</td>
              <td>{item.yield}</td>
              <td>{item.confidence}</td>
              <td>{item.date}</td>

              <td>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                  {item.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}