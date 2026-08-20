import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Home,
  MessageSquare,
  Users,
  LogOut,
  Sprout,
} from "lucide-react";

const items = [
  { label: "Dashboard", path: "/consultant-dashboard", icon: Home },
  { label: "Farmer Management", path: "/consultant/farmers", icon: Users },
  { label: "Consultations", path: "/consultant/consultations", icon: MessageSquare },
  { label: "Analytics", path: "/consultant/analytics", icon: BarChart3 },
  { label: "My Notes", path: "/consultant/notes", icon: FileText },
];

export default function ConsultantSidebar({ collapsed }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "Shivam Dagar";
  const initial = userName.charAt(0).toUpperCase();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  return (
    <aside className={`ys-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="ys-brand">
        <div className="ys-brand-logo">
          <Sprout size={18} />
        </div>
        <div className="ys-brand-copy">
          <strong>YieldSense</strong>
          <span>AI</span>
        </div>
      </div>

      <nav className="ys-sidebar-nav">
        {items.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `ys-nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="ys-sidebar-bottom">
        <div className="ys-side-user">
          <div className="ys-avatar">{initial}</div>
          <div className="ys-side-user-copy">
            <strong>{userName}</strong>
            <span>Consultant</span>
          </div>
        </div>

        <button className="ys-logout" onClick={logout} title={collapsed ? "Logout" : undefined}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
