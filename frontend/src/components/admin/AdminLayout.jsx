import React, { useState } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

import "./admin.css";

const AdminLayout = ({
  activePage,
  setActivePage,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`admin-layout ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >

      {/* ================= SIDEBAR ================= */}

      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />


      {/* ================= MAIN ================= */}

      <div className="admin-main">

        <AdminNavbar
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <main className="admin-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;