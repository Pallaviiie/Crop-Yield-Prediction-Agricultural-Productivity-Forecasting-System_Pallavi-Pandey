import { Outlet } from "react-router-dom";
import ConsultantSidebar from "../components/consultant/ConsultantSidebar";
import ConsultantNavbar from "../components/consultant/ConsultantNavbar";

export default function ConsultantLayout() {
  return (
    <div className="flex bg-[#F7FAF7] min-h-screen">

      {/* Sidebar */}
      <ConsultantSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <ConsultantNavbar />

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}