import { useState } from "react";

import AdminLayout from "../../components/admin/AdminLayout";

import Dashboard from "./Dashboard";
import Users from "./Users";
import Datasets from "./Datasets";
import Predictions from "./Predictions";
import Analytics from "./Analytics";
import ActivityLogs from "./ActivityLogs";
import Profile from "./Profile";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <AdminLayout
      activePage={activePage}
      setActivePage={setActivePage}
    >
      {activePage === "Dashboard" && <Dashboard />}

      {activePage === "User Management" && <Users />}

      {activePage === "Dataset Management" && <Datasets />}

      {activePage === "Prediction Monitor" && <Predictions />}

      {activePage === "Analytics" && <Analytics />}

      {activePage === "Activity Log" && <ActivityLogs />}

      {activePage === "Profile" && <Profile />}
    </AdminLayout>
  );
};

export default AdminDashboard;