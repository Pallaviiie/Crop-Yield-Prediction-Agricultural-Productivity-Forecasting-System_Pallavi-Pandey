import ConsultantHero from "../../components/consultant/ConsultantHero";
import FarmPerformance from "../../components/consultant/FarmPerformance";
import CropRecommendations from "../../components/consultant/CropRecommendations";
import WeatherForecast from "../../components/consultant/WeatherForecast";

export default function ConsultantDashboard() {
  return (
    <div className="space-y-8">

      {/* Hero */}
      <ConsultantHero />

      {/* Three Cards Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

        {/* Farm Performance */}
        <div className="h-full">
          <FarmPerformance />
        </div>

        {/* AI Recommendations */}
        <div className="h-full">
          <CropRecommendations />
        </div>

        {/* Weather */}
        <div className="h-full">
          <WeatherForecast />
        </div>

      </div>

    </div>
  );
}