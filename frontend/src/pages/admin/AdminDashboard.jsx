import HeroBanner from "../../components/admin/HeroBanner";
import PredictionChart from "../../components/admin/PredictionChart";
import CropPieChart from "../../components/admin/CropPieChart";
import RecentUsers from "../../components/admin/RecentUsers";
import BottomSection from "../../components/admin/BottomSection";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">

      {/* Hero */}
      <HeroBanner />

      {/* Charts Row */}
      <div className="grid lg:grid-cols-4 gap-8">

        <div className="lg:col-span-2">
          <PredictionChart />
        </div>

        <div>
          <CropPieChart />
        </div>

        <div>
          <RecentUsers />
        </div>

      </div>

      {/* Bottom Section */}
      <BottomSection />

    </div>
  );
}