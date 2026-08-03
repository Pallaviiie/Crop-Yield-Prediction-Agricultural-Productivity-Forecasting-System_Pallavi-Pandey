import {
  Search,
  Bell,
  Sun,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">

      <h2 className="text-3xl font-bold text-green-700">
        Admin Dashboard
      </h2>

      <div className="flex items-center gap-6">

        {/* Search */}

        <div className="flex items-center border rounded-full px-5 py-2 w-96">

          <Search size={18} />

          <input
            placeholder="Search anything..."
            className="ml-3 flex-1 outline-none"
          />

        </div>

        {/* Notification */}

        <div className="relative">

          <Bell size={24} />

          <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1">
            3
          </span>

        </div>

        {/* Weather */}

        <div className="flex items-center gap-2">

          <Sun className="text-yellow-500" />

          <div>

            <h2 className="font-bold">
              28°C
            </h2>

            <p className="text-xs text-gray-500">
              New Delhi
            </p>

          </div>

        </div>

        {/* Profile */}

        <div className="flex items-center gap-3">

  <div
    className="w-12 h-12 rounded-full
               bg-green-100
               border-2 border-green-500
               flex items-center justify-center
               text-green-700
               font-bold text-lg"
  >
    A
  </div>

  <div>

    <h3 className="font-semibold">
      Admin
    </h3>

  </div>

</div>

      </div>

    </header>
  );
}