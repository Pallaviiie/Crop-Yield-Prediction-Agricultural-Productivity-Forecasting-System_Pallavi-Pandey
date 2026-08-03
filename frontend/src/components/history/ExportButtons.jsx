import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

export default function ExportButtons({ history }) {

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("YieldSense AI - Prediction History", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [[
        "Crop",
        "Area",
        "Year",
        "Yield",
        "Recommendation",
        "Date"
      ]],

      body: history.map((item) => [
        item.crop,
        item.area,
        item.year,
        item.predicted_yield,
        item.recommendation,
        new Date(item.created_at).toLocaleDateString(),
      ]),
    });

    doc.save("Prediction_History.pdf");
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(history);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Prediction History"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(file, "Prediction_History.xlsx");
  };

  return (
    <div className="flex gap-4 mb-6">

      <button
        onClick={exportPDF}
        className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700"
      >
        <Download size={18} />
        Export PDF
      </button>

      <button
        onClick={exportExcel}
        className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700"
      >
        <Download size={18} />
        Export Excel
      </button>

    </div>
  );
}