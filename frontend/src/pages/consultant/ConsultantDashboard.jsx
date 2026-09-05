import { useState } from "react";

import ConsultantLayout from "../../components/consultant/ConsultantLayout";

import Dashboard from "./Dashboard";
import FarmerManagement from "./FarmerManagement";
import Consultation from "./Consultations";
import Analytics from "./Analytics";
import Notes from "./Notes";
import PredictionReview from "./PredictionReview";
import Alerts from "./Alerts";
import Profile from "./Profile";

const ConsultantDashboard = () => {

  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <ConsultantLayout
      activePage={activePage}
      setActivePage={setActivePage}
    >

      {activePage === "Dashboard" && (
        <Dashboard />
      )}

      {activePage === "Farmer Management" && (
        <FarmerManagement />
      )}

      {activePage === "Consultations" && (
        <Consultation />
      )}

      {activePage === "Analytics" && (
        <Analytics />
      )}

      {activePage === "My Notes" && (
        <Notes />
      )}

      {activePage === "Prediction Reviews" && (
        <PredictionReview />
      )}

      {activePage === "Alerts" && (
        <Alerts />
      )}
      
      {activePage === "Profile" && (
        <Profile />
      )}

    </ConsultantLayout>
  );
};

export default ConsultantDashboard;