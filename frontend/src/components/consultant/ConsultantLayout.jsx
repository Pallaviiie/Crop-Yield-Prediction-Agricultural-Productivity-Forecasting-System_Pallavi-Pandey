import { useState } from "react";

import ConsultantSidebar from "./ConsultantSidebar";
import ConsultantNavbar from "./ConsultantNavbar";

import "./consultant.css";

const ConsultantLayout = ({
  children,
  activePage,
  setActivePage,
}) => {

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`consultant-layout ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >

      <ConsultantSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="consultant-main">

        <ConsultantNavbar />

        <main className="consultant-content">
          {children}
        </main>

      </div>

    </div>
  );
};

export default ConsultantLayout;