import {
  UserPlus,
  Sprout,
  Leaf,
  Database,
} from "lucide-react";

const activities = [
  {
    title: "New user registered",
    description: "Rahul Sharma joined the platform",
    time: "2 min ago",
    icon: UserPlus,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "New prediction generated",
    description: "Rice prediction by Priya Verma",
    time: "1 hour ago",
    icon: Sprout,
    color: "bg-lime-100 text-lime-600",
  },
  {
    title: "Soil data updated",
    description: "Soil data updated for Punjab region",
    time: "3 hours ago",
    icon: Leaf,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "System backup completed",
    description: "Daily backup completed successfully",
    time: "5 hours ago",
    icon: Database,
    color: "bg-blue-100 text-blue-600",
  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 h-full">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-xl font-semibold">
          Activity Feed
        </h2>

        <button className="text-green-600 font-medium hover:underline">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {activities.map((activity, index) => {

          const Icon = activity.icon;

          return (
            <div
              key={index}
              className="flex justify-between items-start"
            >

              <div className="flex gap-4">

                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${activity.color}`}
                >
                  <Icon size={22} />
                </div>

                <div>

                  <h3 className="font-semibold">
                    {activity.title}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {activity.description}
                  </p>

                </div>

              </div>

              <span className="text-gray-400 text-sm whitespace-nowrap">
                {activity.time}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}