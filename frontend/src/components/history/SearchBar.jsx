import { Search } from "lucide-react";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="mb-6">

      <div className="flex items-center bg-white border rounded-xl shadow-sm px-4 py-3">

        <Search
          size={20}
          className="text-green-600"
        />

        <input
          type="text"
          placeholder="Search by Crop, Area or Year..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="ml-3 flex-1 outline-none"
        />

      </div>

    </div>
  );
}