import { useState } from "react";

import FarmerLayout from "../../components/farmer/FarmerLayout";

import Dashboard from "./Dashboard";
import WeatherForecast from "./WeatherForecast";
import YieldPrediction from "./YieldPrediction";
import AIRecommendations from "./AIRecommendations";
import AIInsights from "./AIInsights";
import SoilHealth from "./SoilHealth";
import Analytics from "./Analytics";
import Reports from "./Reports";
import PredictionHistory from "./PredictionHistory";
import ChatExpert from "./ChatExpert";
import Profile from "./Profile";

const FarmerDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard setActivePage={setActivePage} />;

      case "Weather Forecast":
        return <WeatherForecast />;
      
      case "Yield Prediction":
        return <YieldPrediction />;

      case "AI Recommendations":
        return <AIRecommendations />;
      
      case "AI Insights":
        return <AIInsights />;

      case "Soil Health":
        return <SoilHealth />;

      case "Analytics":
        return <Analytics />;
      
      case "Reports":
        return <Reports />;

      case "Prediction History":
        return <PredictionHistory />;

      case "Chat Expert":
        return <ChatExpert />;

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