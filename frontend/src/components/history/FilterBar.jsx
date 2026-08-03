export default function FilterBar({
  crop,
  setCrop,
  area,
  setArea,
  year,
  setYear,
  sort,
  setSort,
  history,
}) {
  const crops = [...new Set(history.map((item) => item.crop))];
  const areas = [...new Set(history.map((item) => item.area))];
  const years = [...new Set(history.map((item) => item.year))];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

      <select
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
        className="border rounded-xl p-3"
      >
        <option value="">🌾 All Crops</option>

        {crops.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}

      </select>

      <select
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="border rounded-xl p-3"
      >
        <option value="">🌍 All Areas</option>

        {areas.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}

      </select>

      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="border rounded-xl p-3"
      >
        <option value="">📅 All Years</option>

        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}

      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="border rounded-xl p-3"
      >
        <option value="latest">
          Latest First
        </option>

        <option value="oldest">
          Oldest First
        </option>

      </select>

    </div>
  );
}