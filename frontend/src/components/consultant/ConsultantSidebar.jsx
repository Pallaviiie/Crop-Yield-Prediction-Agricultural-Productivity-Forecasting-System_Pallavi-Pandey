import {
  LayoutDashboard,
  Users,
  Sprout,
  CloudSun,
  FlaskConical,
  Wheat,
  Lightbulb,
  FileBarChart2,
  History,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Users, label: "My Farmers" },
  { icon: Sprout, label: "Field Monitoring" },
  { icon: Wheat, label: "Crop Analysis" },
  { icon: CloudSun, label: "Weather Insights" },
  { icon: FlaskConical, label: "Soil Analysis" },
  { icon: Wheat, label: "Fertilizer Advisory" },
  { icon: Lightbulb, label: "Recommendations" },
  { icon: FileBarChart2, label: "Reports" },
  { icon: History, label: "Consultation History" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Settings, label: "Settings" },
];

export default function ConsultantSidebar() {
  return (
    <aside className="w-72 bg-white border-r min-h-screen flex flex-col justify-between">

      {/* Logo */}
      <div>

        <div className="p-8 border-b">

          <h1 className="text-4xl font-bold text-green-700">
            YieldSense AI
          </h1>

          <p className="text-gray-500 mt-2">
            Smart Farming, Better Future
          </p>

        </div>

        {/* Menu */}

        <div className="p-4 space-y-2">

          {menu.map((item, index) => {

            const Icon = item.icon;

            return (

              <button
                key={index}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all
                ${
                  index === 0
                    ? "bg-green-600 text-white shadow-lg"
                    : "hover:bg-green-50 text-gray-700"
                }`}
              >
                <Icon size={22} />

                <span className="font-medium">
                  {item.label}
                </span>

              </button>

            );
          })}
        </div>

      </div>

      {/* Logout */}

      <div className="p-5 border-t">

        <button className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}