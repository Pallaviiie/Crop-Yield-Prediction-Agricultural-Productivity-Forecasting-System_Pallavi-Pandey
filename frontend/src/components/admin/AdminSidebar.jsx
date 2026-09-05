import React from "react";

import {
  LayoutDashboard,
  Users,
  Database,
  Activity,
  BarChart3,
  ClipboardList,
  UserCircle,
  LogOut,
  Leaf,
  Menu,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


/* =========================================================
   ADMIN MENU ITEMS
========================================================= */

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "User Management",
    icon: Users,
  },
  {
    label: "Dataset Management",
    icon: Database,
  },
  {
    label: "Prediction Monitor",
    icon: Activity,
  },
  {
    label: "Analytics",
    icon: BarChart3,
  },
  {
    label: "Activity Log",
    icon: ClipboardList,
  },
  {
    label: "Profile",
    icon: UserCircle,
  },
];


/* =========================================================
   ADMIN SIDEBAR
========================================================= */

const AdminSidebar = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
}) => {

  const navigate = useNavigate();


  /* =======================================================
     GET ADMIN
  ======================================================= */

  let storedUser = {};

  try {

    storedUser = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  } catch (error) {

    storedUser = {};

  }


  const adminName =
    storedUser?.full_name ||
    storedUser?.name ||
    "Admin User";


  const firstLetter =
    adminName
      .charAt(0)
      .toUpperCase();


  /* =======================================================
     MENU CLICK
  ======================================================= */

  const handleMenuClick = (label) => {

    setActivePage(label);

  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  /* =======================================================
     TOGGLE
  ======================================================= */

  const handleToggle = () => {

    setCollapsed(
      (previous) => !previous
    );

  };


  return (

    <aside
      className={`admin-sidebar ${
        collapsed
          ? "admin-sidebar-collapsed"
          : ""
      }`}
    >


      {/* ===================================================
          BRAND
      =================================================== */}

      <div className="admin-brand">


        {/* =================================================
            LOGO + NAME

            Hidden when collapsed
        ================================================= */}

        {!collapsed && (

          <div className="admin-brand-left">

            <div className="admin-brand-logo">

              <Leaf
                size={19}
                strokeWidth={2}
              />

            </div>


            <div className="admin-brand-text">

              <strong>
                YieldSense
              </strong>

              <span>
                AI
              </span>

            </div>

          </div>

        )}


        {/* =================================================
            SIDEBAR HAMBURGER

            THIS IS THE ONLY HAMBURGER
        ================================================= */}

        <button
          type="button"
          className="admin-sidebar-toggle"
          onClick={handleToggle}
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >

          <Menu
            size={19}
            strokeWidth={2}
          />

        </button>


      </div>


      {/* ===================================================
          MENU
      =================================================== */}

      <div className="admin-sidebar-section">

        <nav className="admin-menu">

          {menuItems.map((item) => {

            const Icon = item.icon;

            const isActive =
              activePage === item.label;


            return (

              <button
                key={item.label}
                type="button"
                className={`admin-menu-item ${
                  isActive
                    ? "admin-menu-item-active"
                    : ""
                }`}
                onClick={() =>
                  handleMenuClick(
                    item.label
                  )
                }
                title={
                  collapsed
                    ? item.label
                    : undefined
                }
              >

                <Icon
                  size={19}
                  strokeWidth={2}
                />


                {!collapsed && (

                  <span>
                    {item.label}
                  </span>

                )}

              </button>

            );

          })}

        </nav>

      </div>


      {/* ===================================================
          BOTTOM USER
      =================================================== */}

      <div className="admin-sidebar-bottom">


        {/* USER */}

        <div className="admin-sidebar-user">

          <div className="admin-sidebar-avatar">

            {firstLetter}

          </div>


          {!collapsed && (

            <div className="admin-sidebar-user-info">

              <strong>
                {adminName}
              </strong>

              <span>
                Admin
              </span>

            </div>

          )}

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
          title={
            collapsed
              ? "Logout"
              : undefined
          }
        >

          <LogOut
            size={18}
            strokeWidth={2}
          />

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


export default AdminSidebar;