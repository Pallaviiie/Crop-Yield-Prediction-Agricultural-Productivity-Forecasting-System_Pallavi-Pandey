import RecentPredictions from "./RecentPredictions";
import SystemHealth from "./SystemHealth";
import ActivityFeed from "./ActivityFeed";

export default function BottomSection() {
  return (
    <div className="grid lg:grid-cols-12 gap-6">

      {/* Recent Predictions */}
      <div className="lg:col-span-6">
        <RecentPredictions />
      </div>

      {/* System Health */}
      <div className="lg:col-span-3">
        <SystemHealth />
      </div>

      {/* Activity Feed */}
      <div className="lg:col-span-3">
        <ActivityFeed />
      </div>

    </div>
  );
}