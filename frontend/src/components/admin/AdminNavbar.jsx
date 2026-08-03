import { Bell, Search, Menu } from "lucide-react";

export default function AdminNavbar() {
  return (
    <header className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">

      <div className="flex items-center gap-5">

        <Menu className="cursor-pointer" />

        <h2 className="text-2xl font-bold text-green-700">
          Admin Dashboard
        </h2>

      </div>

      <div className="flex items-center gap-6">

        {/* Search */}
        <div className="flex items-center border rounded-full px-4 py-2 w-80">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search anything..."
            className="ml-3 flex-1 outline-none"
          />

        </div>

        {/* Notification */}
        <div className="relative cursor-pointer">

          <Bell />

          <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>

        </div>

        {/* Weather */}
        <div className="text-center">
          <h3 className="font-bold">28°C</h3>
          <p className="text-xs text-gray-500">
            New Delhi
          </p>
        </div>

        {/* Admin */}
        <div className="flex items-center gap-3">

          <img
            src="https://i.pravatar.cc/100"
            alt="Admin"
            className="w-11 h-11 rounded-full"
          />

          <div>

            <h4 className="font-semibold">
              Admin
            </h4>

            <p className="text-sm text-gray-500">
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}