import { useEffect, useState } from "react";
import FarmerSidebar from "./FarmerSidebar";
import FarmerNavbar from "./FarmerNavbar";
import "./farmer.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const FarmerLayout = ({
  children,
  activePage,
  setActivePage,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.log("No access token found.");
          return;
        }

        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error(
            "Unable to fetch current user:",
            response.status
          );
          return;
        }

        const data = await response.json();

        console.log("Current logged-in user:", data);

        setUser(data);
      } catch (error) {
        console.error(
          "Error fetching current user:",
          error
        );
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="farmer-layout">

      {/* =================================================
          LEFT SIDEBAR
      ================================================= */}

      <FarmerSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
        user={user}
      />

      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div
        className={`farmer-main ${
          collapsed ? "sidebar-collapsed" : ""
        }`}
      >

        {/* =================================================
            TOP NAVBAR
        ================================================= */}

        <FarmerNavbar
          activePage={activePage}
          user={user}
        />

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="farmer-content">
          {children}
        </main>

      </div>
    </div>
  );
};

export default FarmerLayout;