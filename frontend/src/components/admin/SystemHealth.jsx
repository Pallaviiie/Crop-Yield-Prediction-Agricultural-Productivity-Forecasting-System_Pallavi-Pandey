import {
  Database,
  Server,
  Brain,
  ShieldCheck,
} from "lucide-react";

const systems = [
  {
    title: "API Status",
    subtitle: "All systems operational",
    status: "Healthy",
    icon: ShieldCheck,
  },
  {
    title: "Database",
    subtitle: "Connected",
    status: "Healthy",
    icon: Database,
  },
  {
    title: "ML Model",
    subtitle: "Running smoothly",
    status: "Healthy",
    icon: Brain,
  },
  {
    title: "Server",
    subtitle: "Uptime 99.9%",
    status: "Healthy",
    icon: Server,
  },
];

export default function SystemHealth() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-semibold">
          System Health
        </h2>

        <button className="text-green-600 font-medium hover:underline">
          View Details
        </button>

      </div>

      <div className="space-y-5">

        {systems.map((item, index) => {

          const Icon = item.icon;

          return (
            <div
              key={index}
              className="flex items-center justify-between"
            >

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Icon
                    size={22}
                    className="text-green-600"
                  />
                </div>

                <div>

                  <h3 className="font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {item.subtitle}
                  </p>

                </div>

              </div>

              <span className="text-green-600 font-semibold">
                {item.status}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}