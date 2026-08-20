import { useState } from "react";

import FarmerLayout from "../../components/farmer/FarmerLayout";

import Dashboard from "./Dashboard";
import YieldPrediction from "./YieldPrediction";
import WeatherForecast from "./WeatherForecast";
import AIRecommendations from "./AIRecommendations";
import SoilHealth from "./SoilHealth";
import Analytics from "./Analytics";
import Reports from "./Reports";
import PredictionHistory from "./PredictionHistory";
import AIInsights from "./AIInsights";
import Profile from "./Profile";

const FarmerDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard setActivePage={setActivePage} />;

      case "Yield Prediction":
        return <YieldPrediction />;

      case "Weather Forecast":
        return <WeatherForecast />;

      case "AI Recommendations":
        return <AIRecommendations />;

      case "Soil Health":
        return <SoilHealth />;

      case "Analytics":
        return <Analytics />;
      
      case "Reports":
        return <Reports />;

      case "Prediction History":
        return <PredictionHistory />;

      case "AI Insights":
        return <AIInsights />;

      case "Profile":
        return <Profile />;

      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <FarmerLayout
      activePage={activePage}
      setActivePage={setActivePage}
    >
      {renderPage()}
    </FarmerLayout>
  );
};

export default FarmerDashboard;