import {
  LayoutDashboard,
  Sprout,
  CloudSun,
  Leaf,
  FlaskConical,
  History,
  FileBarChart,
  Settings,
  LogOut,
} from "lucide-react";

import cropLogo from "../../assets/crop-logo.png";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-white shadow-lg flex flex-col">

      {/* Logo */}

      <div className="flex items-center gap-3 px-6 py-5 border-b">

        <img
          src={cropLogo}
          alt="logo"
          className="w-14 h-14 object-contain"
        />

        <div>
          <h1 className="text-3xl font-bold text-green-700">
            YieldSense AI
          </h1>

          <p className="text-sm text-gray-500">
            Smart Farming
          </p>
        </div>

      </div>

      {/* Menu */}

      <nav className="flex-1 overflow-y-auto mt-6 px-3">

        <MenuItem active icon={<LayoutDashboard size={22} />} text="Dashboard" />
        <MenuItem icon={<Sprout size={22} />} text="Crop Prediction" />
        <MenuItem icon={<CloudSun size={22} />} text="Weather Analysis" />
        <MenuItem icon={<Leaf size={22} />} text="Soil Health" />
        <MenuItem icon={<FlaskConical size={15} />} text="Fertilizer Recommendation" />
        <MenuItem icon={<History size={22} />} text="Prediction History" />
        <MenuItem icon={<FileBarChart size={22} />} text="Reports" />
        <MenuItem icon={<Settings size={22} />} text="Settings" />

      </nav>

      {/* Logout */}

      <div className="mt-auto border-t p-5">
  <button className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium">
    <LogOut size={20} />
    Logout
  </button>
</div>

    </aside>
  );
}

function MenuItem({ icon, text, active }) {
  return (
    <button
      className={`w-full flex items-center gap-4 rounded-xl px-5 py-3 mb-3 transition-all duration-300 ${
        active
          ? "bg-green-600 text-white shadow-lg"
          : "text-gray-700 hover:bg-green-100"
      }`}
    >
      {icon}

      <span className="text-[16px] font-medium">
        {text}
      </span>
    </button>
  );
}