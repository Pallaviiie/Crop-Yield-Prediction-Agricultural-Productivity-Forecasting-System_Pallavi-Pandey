import { UserCircle } from "lucide-react";

const users = [
  {
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    time: "2 min ago",
  },
  {
    name: "Priya Verma",
    email: "priya@gmail.com",
    time: "1 hour ago",
  },
  {
    name: "Ramesh Patel",
    email: "ramesh@gmail.com",
    time: "3 hours ago",
  },
  {
    name: "Anjali Singh",
    email: "anjali@gmail.com",
    time: "Yesterday",
  },
];

export default function RecentUsers() {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">

      <div className="flex justify-between mb-6">

        <h2 className="font-semibold text-xl">
          Recent Users
        </h2>

        <button className="text-green-600">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {users.map((user, index) => (

          <div
            key={index}
            className="flex justify-between items-center"
          >

            <div className="flex gap-3">

              <UserCircle
                size={42}
                className="text-green-600"
              />

              <div>

                <h3 className="font-semibold">
                  {user.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  {user.email}
                </p>

              </div>

            </div>

            <span className="text-gray-400 text-sm">
              {user.time}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}