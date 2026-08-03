import { useEffect, useState } from "react";

import SearchBar from "../../components/history/SearchBar";
import FilterBar from "../../components/history/FilterBar";
import HistoryTable from "../../components/history/HistoryTable";
import ExportButtons from "../../components/history/ExportButtons";
// import HistoryCard from "../../components/history/HistoryCard"; // Use later if you want card view

import {
  getHistory,
  deleteHistory,
} from "../../services/historyApi";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [crop, setCrop] = useState("");
  const [area, setArea] = useState("");
  const [year, setYear] = useState("");

  const [sort, setSort] = useState("latest");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistory(id);

      setHistory(history.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleView = (item) => {
    alert(`
Crop : ${item.crop}
Area : ${item.area}
Year : ${item.year}

Yield : ${item.predicted_yield} hg/ha

Recommendation:
${item.recommendation}
`);
  };

  const filteredHistory = history
    .filter((item) => {
      const keyword = searchTerm.toLowerCase();

      const matchesSearch =
        item.crop.toLowerCase().includes(keyword) ||
        item.area.toLowerCase().includes(keyword) ||
        item.year.toString().includes(keyword);

      const matchesCrop =
        crop === "" || item.crop === crop;

      const matchesArea =
        area === "" || item.area === area;

      const matchesYear =
        year === "" || item.year.toString() === year;

      return (
        matchesSearch &&
        matchesCrop &&
        matchesArea &&
        matchesYear
      );
    })
    .sort((a, b) => {
      if (sort === "latest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }

      return new Date(a.created_at) - new Date(b.created_at);
    });

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold text-green-700 mb-6">
        🌾 Prediction History
      </h1>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <FilterBar
        crop={crop}
        setCrop={setCrop}
        area={area}
        setArea={setArea}
        year={year}
        setYear={setYear}
        sort={sort}
        setSort={setSort}
        history={history}
      />
      <SearchBar
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
/>

<FilterBar
  crop={crop}
  setCrop={setCrop}
  area={area}
  setArea={setArea}
  year={year}
  setYear={setYear}
  sort={sort}
  setSort={setSort}
  history={history}
/>

<ExportButtons history={filteredHistory} />

<HistoryTable
  history={filteredHistory}
  onDelete={handleDelete}
  onView={handleView}
/>
      {loading ? (
        <div className="text-center mt-10">
          Loading History...
        </div>
      ) : (
        <HistoryTable
          history={filteredHistory}
          onDelete={handleDelete}
          onView={handleView}
        />
      )}

    </div>
  );
}