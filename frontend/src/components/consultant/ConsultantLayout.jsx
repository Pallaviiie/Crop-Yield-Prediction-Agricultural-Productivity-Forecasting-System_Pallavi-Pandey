import React, { useState } from "react";
import ConsultantNavbar from "./ConsultantNavbar";
import ConsultantSidebar from "./ConsultantSidebar";
import "./consultant.css";

export default function ConsultantLayout({ children, title }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="ys-consultant-app">
      <ConsultantSidebar collapsed={collapsed} />

      <div className={`ys-consultant-main ${collapsed ? "is-collapsed" : ""}`}>
        <ConsultantNavbar
          title={title}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
        <main className="ys-consultant-content">{children}</main>
      </div>
    </div>
  );
}
