import { useEffect, useState } from "react";

import {
  Home,
  Target,
  Cloud,
  Zap,
  Gauge,
  BarChart3,
  History,
  Activity,
  Menu,
  LogOut,
  UserCircle,
  MessageCircle,
  FileText,
} from "lucide-react";

import cropLogo from "../../assets/crop-logo.png";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const FarmerSidebar = ({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage,
}) => {

  const [user, setUser] = useState(null);

  /* =====================================================
     FETCH LOGGED-IN USER
  ===================================================== */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          console.log("No access token found");
          return;
        }

        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch user:", response.status);
          return;
        }

        const data = await response.json();

        console.log("Sidebar logged-in user:", data);

        setUser(data);

      } catch (error) {
        console.error(
          "Error fetching sidebar user:",
          error
        );
      }
    };

    fetchUser();
  }, []);

  /* =====================================================
     USER DISPLAY DATA
  ===================================================== */

  const userName =
    user?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  const userRole =
    user?.role
      ? user.role.charAt(0).toUpperCase() +
        user.role.slice(1)
      : "Farmer";

  const userInitial =
    userName.charAt(0).toUpperCase();

  /* =====================================================
     SIDEBAR MENU
  ===================================================== */

  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Weather Forecast", icon: Cloud },
    { name: "Yield Prediction", icon: Target },
    { name: "AI Recommendations", icon: Zap },
    { name: "AI Insights", icon: Activity },
    { name: "Soil Health", icon: Gauge },
    { name: "Analytics", icon: BarChart3 },
    { name: "Reports", icon: FileText },
    { name: "Prediction History", icon: History },
    {name: "Chat Expert", icon: MessageCircle },
    { name: "Profile", icon: UserCircle },
  ];

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    // If you also save user information:
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <aside
      className={`farmer-sidebar ${
        collapsed ? "collapsed" : ""
      }`}
    >

      {/* =================================================
          TOP
      ================================================= */}

      <div className="sidebar-top">

        <div className="sidebar-logo">

          <div className="logo-image-container">
            <img
              src={cropLogo}
              alt="YieldSense AI Logo"
              className="sidebar-logo-image"
            />
          </div>

          {!collapsed && (
            <div className="logo-text">
              <strong>YieldSense</strong>
              <span>AI</span>
            </div>
          )}

        </div>

        <button
          className="collapse-btn"
          onClick={() =>
            setCollapsed(!collapsed)
          }
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

      </div>

      {/* =================================================
          MENU
      ================================================= */}

      <nav className="sidebar-menu">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() =>
                setActivePage(item.name)
              }
              className={`sidebar-item ${
                activePage === item.name
                  ? "active"
                  : ""
              }`}
              title={
                collapsed
                  ? item.name
                  : ""
              }
            >

              <Icon size={18} />

              {!collapsed && (
                <span>{item.name}</span>
              )}

            </button>
          );
        })}

      </nav>

      {/* =================================================
          BOTTOM
      ================================================= */}

      <div className="sidebar-bottom">

        {/* USER PROFILE */}

        <div className="sidebar-profile">

          <div className="profile-avatar">
            {userInitial}
          </div>

          {!collapsed && (
            <div className="sidebar-user-info">
              <strong>{userName}</strong>
              <span>{userRole}</span>
            </div>
          )}

        </div>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={17} />

          {!collapsed && (
            <span>Logout</span>
          )}
        </button>

      </div>

    </aside>
  );
};

export default FarmerSidebar;