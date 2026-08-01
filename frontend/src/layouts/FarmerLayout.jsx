import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";

export default function FarmerLayout() {
  return (
    <div className="bg-[#F6FBF4]">

      <Sidebar />

      <div className="ml-72 flex flex-col min-h-screen">

        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}