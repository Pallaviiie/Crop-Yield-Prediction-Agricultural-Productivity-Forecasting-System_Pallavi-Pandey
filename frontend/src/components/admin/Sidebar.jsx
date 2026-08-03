import {
  LayoutDashboard,
  Users,
  Sprout,
  CloudSun,
  FlaskConical,
  History,
  BarChart3,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "User Management",
    icon: Users,
  },
  {
    title: "Crop Prediction",
    icon: Sprout,
  },
  {
    title: "Weather Analysis",
    icon: CloudSun,
  },
  {
    title: "Soil Analysis",
    icon: FlaskConical,
  },
  {
    title: "Prediction History",
    icon: History,
  },
  {
    title: "Reports & Analytics",
    icon: BarChart3,
  },
  {
    title: "System Logs",
    icon: FileText,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white shadow-xl flex flex-col">

      {/* Logo */}

      <div className="p-6 border-b">

        <h1 className="text-3xl font-bold text-green-700">
          YieldSense AI
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Smart Farming, Better Future
        </p>

      </div>

      {/* Menu */}

      <nav className="flex-1 p-4">

        {menu.map((item, index) => {

          const Icon = item.icon;

          return (
            <button
              key={index}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl mb-3 transition
              ${
                index === 0
                  ? "bg-green-600 text-white"
                  : "hover:bg-green-50 text-gray-700"
              }`}
            >
              <Icon size={20} />
              {item.title}
            </button>
          );
        })}

      </nav>


        <div className="p-6 border-t mt-auto">

  <button
    className="w-full flex items-center justify-center gap-3
               py-3 rounded-xl border border-red-200
               text-red-600 hover:bg-red-50 transition"
  >
    <LogOut size={20} />
    Logout
  </button>

</div>



    </aside>
  );
}