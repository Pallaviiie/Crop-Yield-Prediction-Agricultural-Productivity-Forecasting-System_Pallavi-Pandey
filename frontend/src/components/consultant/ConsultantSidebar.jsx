import { useEffect, useState } from "react";

import {
  Home,
  Users,
  MessageCircle,
  BarChart3,
  FileText,
  Menu,
  LogOut,
  UserCircle,
  Bell,
  ClipboardCheck,
} from "lucide-react";

import cropLogo from "../../assets/crop-logo.png";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const ConsultantSidebar = ({
  collapsed,
  setCollapsed,
  activePage,
  setActivePage,
}) => {

  const [user, setUser] = useState(null);

  /* =====================================================
     FETCH LOGGED-IN CONSULTANT
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
          console.error(
            "Failed to fetch consultant:",
            response.status
          );
          return;
        }

        const data = await response.json();

        console.log(
          "Consultant logged-in user:",
          data
        );

        setUser(data);

      } catch (error) {
        console.error(
          "Error fetching consultant:",
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
    "Consultant";

  const userRole =
    user?.role
      ? user.role.charAt(0).toUpperCase() +
        user.role.slice(1)
      : "Consultant";

  const userInitial =
    userName.charAt(0).toUpperCase();


  /* =====================================================
     CONSULTANT MENU
     ===================================================== */

  const menuItems = [
    {
      name: "Dashboard",
      icon: Home,
    },

    {
      name: "Farmer Management",
      icon: Users,
    },

    {
      name: "Consultations",
      icon: MessageCircle,
    },

    {
      name: "Analytics",
      icon: BarChart3,
    },

    {
      name: "My Notes",
      icon: FileText,
    },

    {
      name: "Prediction Reviews",
      icon: ClipboardCheck,
    },

    {
      name: "Alerts",
      icon: Bell,
    },

    {
      name: "Profile",
      icon: UserCircle,
    },
  ];


  /* =====================================================
     LOGOUT
     ===================================================== */

  const handleLogout = () => {

    localStorage.removeItem("access_token");

    localStorage.removeItem("user");

    window.location.href = "/";
  };


  return (
    <aside
      className={`consultant-sidebar ${
        collapsed ? "collapsed" : ""
      }`}
    >

      {/* =================================================
          TOP
      ================================================= */}

      <div className="consultant-sidebar-top">

        {/* LOGO */}

        <div className="consultant-sidebar-logo">

          <div className="consultant-logo-image-container">

            <img
              src={cropLogo}
              alt="YieldSense AI Logo"
              className="consultant-sidebar-logo-image"
            />

          </div>


          {!collapsed && (
            <div className="consultant-logo-text">

              <strong>
                YieldSense
              </strong>

              <span>
                Consultant Portal
              </span>

            </div>
          )}

        </div>


        {/* COLLAPSE BUTTON */}

        <button
          className="consultant-collapse-btn"
          onClick={() =>
            setCollapsed(!collapsed)
          }
          aria-label="Toggle consultant sidebar"
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          <Menu size={20} />
        </button>

      </div>


      {/* =================================================
          MENU
      ================================================= */}

      <nav className="consultant-sidebar-menu">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.name}
              onClick={() =>
                setActivePage(item.name)
              }
              className={`consultant-sidebar-item ${
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
                <span>
                  {item.name}
                </span>
              )}

            </button>
          );
        })}

      </nav>


      {/* =================================================
          BOTTOM
      ================================================= */}

      <div className="consultant-sidebar-bottom">

        {/* USER PROFILE */}

        <div className="consultant-sidebar-profile">

          <div className="consultant-profile-avatar">
            {userInitial}
          </div>


          {!collapsed && (
            <div className="consultant-sidebar-user-info">

              <strong>
                {userName}
              </strong>

              <span>
                {userRole}
              </span>

            </div>
          )}

        </div>


        {/* LOGOUT */}

        <button
          className="consultant-logout-btn"
          onClick={handleLogout}
          title={
            collapsed
              ? "Logout"
              : ""
          }
        >

          <LogOut size={17} />

          {!collapsed && (
            <span>
              Logout
            </span>
          )}

        </button>

      </div>

    </aside>
  );
};

export default ConsultantSidebar;