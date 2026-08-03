import {
  Search,
  Bell,
  ChevronDown,
  Sun,
} from "lucide-react";

export default function ConsultantNavbar() {
  return (
    <header className="h-24 bg-white shadow-sm px-10 flex items-center justify-between">

      {/* Dashboard Title */}
      <h1 className="text-3xl font-bold text-green-700">
        Consultant Dashboard
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-8">

        {/* Search */}
        <div className="relative">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search farmers, crops, fields..."
            className="w-[420px] pl-12 pr-5 py-4 rounded-full border focus:outline-none focus:ring-2 focus:ring-green-500"
          />

        </div>

        {/* Notification */}
        <div className="relative">

          <Bell size={24} className="text-gray-700" />

          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
            5
          </span>

        </div>

        {/* Weather */}
        <div className="flex items-center gap-3">

          <Sun className="text-yellow-500" size={30} />

          <div>

            <h3 className="font-bold text-xl">
              28°C
            </h3>

            <p className="text-sm text-gray-500">
              New Delhi
            </p>

          </div>

        </div>

        {/* Consultant */}
        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center text-xl font-bold text-green-700">
            C
          </div>

          <div>

            <h3 className="font-semibold">
              Consultant
            </h3>

            <p className="text-sm text-gray-500">
              Agri Expert
            </p>

          </div>

          <ChevronDown />

        </div>

      </div>

    </header>
  );
}