import HeroBanner from "../../components/common/HeroBanner";
import StatsCards from "../../components/farmer/StatsCards";
import CropPrediction from "../../components/farmer/CropPrediction";
import YieldChart from "../../components/farmer/YieldChart";
import WeatherCard from "../../components/farmer/WeatherCard";
import SoilHealth from "../../components/farmer/SoilHealth";
import Recommendation from "../../components/farmer/Recommendation";
import PredictionTable from "../../components/farmer/PredictionTable";

export default function Dashboard() {
  return (
    <div className="space-y-6">

      <HeroBanner />

      <StatsCards />

      {/* Row 1 */}
   <div className="grid grid-cols-12 gap-4">

    <div className="col-span-6">
        <CropPrediction />
    </div>

    <div className="col-span-3">
        <WeatherCard />
    </div>

    <div className="col-span-3">
        <SoilHealth />
    </div>

</div>

      {/* Row 2 */}
     {/* Bottom Section */}

<div className="grid grid-cols-12 gap-6">

    {/* Chart */}
    <div className="col-span-5">
        <YieldChart />
    </div>

    {/* Recent Predictions */}
    <div className="col-span-4">
        <PredictionTable />
    </div>

    {/* AI Recommendation */}
    <div className="col-span-3">
        <Recommendation />
    </div>

</div>

    </div>
  );
}