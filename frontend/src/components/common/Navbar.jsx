import {
  Search,
  Bell,
  Sun,
  User,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8">

      {/* Left Side */}

      <div className="relative">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search anything..."
          className="w-[360px] pl-12 pr-4 py-3 rounded-full border border-gray-200 outline-none focus:ring-2 focus:ring-green-500"
        />

      </div>

      {/* Right Side */}

      <div className="flex items-center gap-8">

        {/* Notification */}

        <button className="relative">

          <Bell className="text-gray-700" size={22} />

          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-600 rounded-full"></span>

        </button>

        {/* Weather */}

        <div className="flex items-center gap-2">

          <Sun className="text-yellow-500" size={24} />

          <div>

            <p className="font-semibold text-gray-800">
              28°C
            </p>

            <p className="text-xs text-gray-500">
              New Delhi
            </p>

          </div>

        </div>

        {/* User */}

        <div className="flex items-center gap-3 cursor-pointer">

          <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">

            <User
              size={22}
              className="text-green-700"
            />

          </div>

          <div>

            <p className="font-semibold text-gray-800">
              Hello, Farmer
            </p>

            <p className="text-sm text-gray-500">
              Welcome Back
            </p>

          </div>

          <ChevronDown
            size={18}
            className="text-gray-500"
          />

        </div>

      </div>

    </header>
  );
}